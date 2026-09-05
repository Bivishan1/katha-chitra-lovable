import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResourceManager } from "./ResourceManager";
import { useEquipment, useSiteSettings, npr } from "@/lib/cms";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";


type Option = { value: string; label: string };

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  disabled,
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          <span className={cn("truncate", !current && "text-muted-foreground")}>
            {current?.label ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.label}
                  onSelect={() => {
                    onChange(o.value === value ? "" : o.value);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === o.value ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{o.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}



type EquipmentItemRow = Record<string, unknown> & {
  price_day?: number | string;
  price_week?: number | string;
};

export function EquipmentManager() {
  const { data } = useEquipment(true);
  const { data: settings } = useSiteSettings();
  const qc = useQueryClient();
  const categories = useMemo(() => data?.categories ?? [], [data?.categories]);
  const items = useMemo(() => data?.items ?? [], [data?.items]);

// new priced toggle for CMS
const togglePrices = useMutation({
    mutationFn: async (next: boolean) => {
      if (settings?.id) {
        const { error } = await supabase
          .from("site_settings")
          .update({ show_equipment_prices: next } as never)
          .eq("id", settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_settings")
          .insert({ show_equipment_prices: next } as never);
        if (error) throw error;
      }
    },
    onSuccess: (_d, next) => {
      toast.success(next ? "Prices are now visible on the website" : "Prices are hidden from the website");
      qc.invalidateQueries({ queryKey: ["cms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });


  const [categoryId, setCategoryId] = useState<string>("");
  const active = categoryId || categories[0]?.id || "";
  const [days, setDays] = useState<Record<string, number>>({});
  const [discount, setDiscount] = useState<Record<string, number>>({});
  // const [qty, setQty] = useState<Record<string, number>>({});

// Quote calculator filters
  const [filterItemId, setFilterItemId] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterCatItemId, setFilterCatItemId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories],
  );
  const itemOptions = useMemo(() => items.map((i) => ({ value: i.id, label: i.name })), [items]);
  const categoryItemOptions = useMemo(
    () =>
      items
        .filter((i) => !filterCategoryId || i.category_id === filterCategoryId)
        .map((i) => ({ value: i.id, label: i.name })),
    [items, filterCategoryId],
  );

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return items.filter((i) => {
      if (filterItemId && i.id !== filterItemId) return false;
      if (filterCategoryId && i.category_id !== filterCategoryId) return false;
      if (filterCatItemId && i.id !== filterCatItemId) return false;
      if (term && !i.name.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [items, filterItemId, filterCategoryId, filterCatItemId, searchTerm]);

  const filtersActive =
    Boolean(filterItemId || filterCategoryId || filterCatItemId || searchTerm.trim());

  const clearFilters = () => {
    setFilterItemId("");
    setFilterCategoryId("");
    setFilterCatItemId("");
    // setSearchDraft("");
    setSearchTerm("");
  };


  // cms close

  const total = useMemo(() => {
    return items.reduce(
      (acc, i) => {
        const q = days[i.id] ?? 0;
        const weekCost = 7 * Number(i.price_day ?? 0);
        return {
          day: acc.day + q * Number(i.price_day ?? 0),
          week: acc.week + q * weekCost,
        };
      },
      { day: 0, week: 0 },
    );
  }, [items, days]);

  const selected = items.filter((i) => (days[i.id] ?? 0) > 0);
  const totalDiscount = Object.values(discount).reduce((sum, disc) => sum + disc, 0);
  return (
    <div className="space-y-8">
      {/* CMS price toggle hide UI */}
      <section className="border border-border rounded-sm p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg uppercase tracking-tight">
            Show prices on the website
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-lg">
            Off by default — visitors see the equipment list without prices. Turn on to publish daily and weekly rates
            publicly. Admin prices and the quote calculator below always stay available to you.
          </p>
        </div>
        <Switch
          checked={Boolean(settings?.show_equipment_prices)}
          disabled={togglePrices.isPending}
          onCheckedChange={(v) => togglePrices.mutate(v)}
          aria-label="Show equipment prices publicly"
        />
      </section>
{/* CMS price toggle close */}
      <ResourceManager
        table="equipment_categories"
        title="Equipment Categories"
        description="Groups shown on the public rentals page."
        orderBy="sort_order"
        defaults={{ sort_order: categories.length + 1, description: "" }}
        columns={[
          { key: "name", label: "Name" },
          { key: "sort_order", label: "Order" },
        ]}
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea" },
          { key: "image_url", label: "Background image", type: "image" },
          { key: "sort_order", label: "Sort order", type: "number" },
        ]}
      />

      <div className="space-y-3">
        <Label htmlFor="cat-picker">Manage items in category</Label>
        <select
          id="cat-picker"
          value={active}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full sm:w-80 h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {active && (
          <ResourceManager
            key={active}
            table="equipment_items"
            title="Equipment & Prices"
            description="Prices are private — the public site never shows them."
            orderBy="sort_order"
            extraFilter={{ column: "category_id", value: active }}
            defaults={{ price_day: 0, price_week: 0, sort_order: 1 }}
            columns={[
              { key: "name", label: "Item" },
              { key: "price_day", label: "Per day", render: (row: EquipmentItemRow) => npr(Number(row.price_day)) },
              { key: "price_week", label: "Per week", render: (row: EquipmentItemRow) => npr(Number(row.price_week)) },
            ]}
            fields={[
              { key: "name", label: "Item name", type: "text", required: true },
              { key: "image_url", label: "Main photo", type: "image" },
              {
                key: "images",
                label: "More photos (gallery)",
                type: "gallery",
                help: "Shown as a slider with thumbnails on the public page.",
              },
              {
                key: "description",
                label: "Description / product details",
                type: "textarea",
                help: "Optional. Use new lines for bullet points (Output: 1200W LED, etc.).",
              },
              {
                key: "sub_items",
                label: "Included items (kit contents)",
                type: "subitems",
                help: "Optional. Use this for sets/bundles — each item can have its own photo.",
              },
              { key: "price_day", label: "Price per day (NPR)", type: "number" },
              { key: "price_week", label: "Price per week (NPR)", type: "number" },
              { key: "note", label: "Note (e.g. Quoted per shoot)", type: "text" },
              { key: "sort_order", label: "Sort order", type: "number" },
            ]}
          />
        )}
      </div>

      {/* Quote calculator */}
      <section className="border border-border rounded-sm">
        <header className="px-4 sm:px-5 py-4 border-b border-border">
          <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg uppercase tracking-tight">
            Quote Calculator
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Enter quantities to total up a client's kit list. Admin-only.
          </p>
        </header>
        {/* new added */}
        <div className="px-4 sm:px-5 py-4 border-b border-border grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <div className="space-y-1.5">
            <Label className="text-xs">All equipment</Label>
            <SearchableSelect
              options={itemOptions}
              value={filterItemId}
              onChange={setFilterItemId}
              placeholder="All equipment"
              searchPlaceholder="Search equipment..."
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <SearchableSelect
              options={categoryOptions}
              value={filterCategoryId}
              onChange={(v) => {
                setFilterCategoryId(v);
                setFilterCatItemId("");
              }}
              placeholder="All categories"
              searchPlaceholder="Search categories..."
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Equipment in category</Label>
            <SearchableSelect
              options={categoryItemOptions}
              value={filterCatItemId}
              onChange={setFilterCatItemId}
              placeholder={filterCategoryId ? "All in category" : "Pick a category first"}
              searchPlaceholder="Search equipment..."
              disabled={!filterCategoryId}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="quote-search">Search</Label>
            <div className="flex gap-2">
              <Input
                id="quote-search"
                value={searchTerm}
                placeholder="Search by name"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="lg:w-48"
              />
              {filtersActive && (
                <Button type="button" variant="ghost" onClick={clearFilters} aria-label="Clear filters">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-border">
           {filteredItems.length === 0 && (
            <p className="px-4 sm:px-5 py-6 text-sm text-muted-foreground">No equipment matches these filters.</p>
          )}
          {filteredItems.map((i) => (
            <div key={i.id} className="px-4 sm:px-5 py-2.5 flex items-center gap-4">
              <span className="flex-1 text-sm truncate">{i.name}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {npr(Number(i.price_day ?? 0))} / day
              </span>
              <div className="flex flex-col items-end gap-1">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Days</Label>
                <Input
                  type="number"
                  min={0}
                  className="w-20"
                  value={days[i.id] ?? 0}
                  onChange={(e) => setDays((d) => ({ ...d, [i.id]: Number(e.target.value) }))}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-6">
          <div style={{background: "oklch(0.68 0.13 55)"}} className="flex justify-center px-4 sm:px-5 py-3 border-b border-border">
            <h4 className="uppercase tracking-tight text-4xl">
              Selected Items
            </h4>
            {selected.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDays({});
                  setDiscount({});
                }}
              >
                <X className="h-4 w-4 mr-1.5" /> Clear all
              </Button>
            )}
          </div>
        <div className=" py-1 border-t border-border space-y-1">
          {/* new table design added */}
          <div className="overflow-x-auto">
            <table className="w-full bg-amber-200 text-black border border-border text-sm">
              <thead>
                <tr className="border-b border-border text-center text-xs uppercase tracking-wider">
                  <th className="py-2 pr-3 border border-gray-800">Items</th>
                  <th className="py-2 pr-3 text-right border border-gray-800">Day Total </th>
                  <th className="py-2 pr-3 text-right border border-gray-800">Week Total</th>
                  <th className="py-2 pr-3 text-right border border-gray-800">Discount (%)</th>
                  <th className="py-2 pr-3 text-right border border-gray-800">After discount (day total)</th>
                  <th className="py-2 text-right border border-gray-800">After discount (week total)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {selected.map((i, index) => {
                  const d = days[i.id] ?? 0;
                  const disc = discount[i.id] ?? 0;
                  const day = d * Number(i.price_day ?? 0);
                  const week = d * 7 * Number(i.price_day ?? 0);
                  const factor = day - (day * (disc / 100));
                  return (
                    <tr key={i.id} className="group border border-gray-800">
                      <td className="py-2 pr-3 align-middle border border-gray-800">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-sm bg-amber-800 text-xs font-semibold shrink-0"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {index + 1}
                          </span>
                          <span className="text-sm">
                            {d} x {i.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setDays((prev) => {
                                const next = { ...prev };
                                delete next[i.id];
                                return next;
                              });
                              setDiscount((prev) => {
                                const next = { ...prev };
                                delete next[i.id];
                                return next;
                              });
                            }}
                            className="ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                            aria-label="Remove item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-right align-middle border border-gray-800">{npr(day)}</td>
                      <td className="py-2 pr-3 text-right align-middle border border-gray-800">{npr(week)}</td>
                      <td className="py-2 pr-3 text-right align-middle border border-gray-800">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={0.01}
                          className="w-20 ml-auto text-right bg-amber-300"
                          value={disc}
                          onChange={(e) =>
                            setDiscount((prev) => ({ ...prev, [i.id]: Number(e.target.value) }))
                          }
                        />
                      </td>
                      <td className="py-2 pr-3 text-center align-middle border border-gray-800">{npr(factor)}</td>
                      <td className="py-2 text-center align-middle border border-gray-800">{npr(week - (week * (disc / 100)))}</td>
                    </tr>
                  );
                })}
                {selected.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-sm text-muted-foreground">
                      No items selected. Enter days above to build a quote.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="border-t-2 border-border bg-muted/40">
                <tr className="font-medium">
                  <td className="py-3 pr-3 border border-gray-800">
                   
                    <div className="text-xs uppercase text-center font-bold ">
                       {/* <p>Total =     </p> */}
                      Count : {selected.length} || Day :{" "}
                      {selected.reduce((sum, i) => sum + (days[i.id] ?? 0), 0)}
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-center text-sm uppercase border border-gray-800 ">
                     {npr(total.day)}
                  </td>
                  <td className="py-3 pr-3 text-center align-middle font-semibold border border-gray-800">
                    {npr(total.week)}
                  </td>
                  <td id = 'totalDiscount' className="py-3 pr-3 text-center align-middle border border-gray-800">
                   { // total discount
                   }
                  {totalDiscount + '%'}
                  </td>
                  <td className="py-3 pr-3 text-center align-middle font-semibold border border-gray-800">
                    {npr(
                      selected.reduce((sum, i) => {
                        const d = days[i.id] ?? 0;
                        const disc = discount[i.id] ?? 0;
                        return sum + d * Number(i.price_day ?? 0) * (1 - disc / 100);
                      }, 0),
                    )}
                  </td>
                  <td className="py-3 text-center align-middle font-semibold border border-gray-800">
                    {npr(
                      selected.reduce((sum, i) => {
                        const d = days[i.id] ?? 0;
                        const disc = discount[i.id] ?? 0;
                        return sum + d * 7 * Number(i.price_day ?? 0) * (1 - disc / 100);
                      }, 0),
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
           {selected.length > 0 && (
            <div className="pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => { setDays({}); setDiscount({}); }}>
                <X className="h-4 w-4 mr-1.5" /> Clear order values
              </Button>
            </div>
          )}
        </div>
        </div>
      </section>
    </div>
  );
}