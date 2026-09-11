"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Filter,
  Pill,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  Tag,
  X,
} from "lucide-react";
import { CATEGORIES, MEDICINES, availableAts } from "@/lib/data";
import { useApp } from "@/lib/store";
import { EmptyState } from "./ui";
import { MedicineCard } from "./MedicineCard";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/useMounted";

type SortKey = "relevance" | "price-asc" | "price-desc" | "eta" | "rating";

// Dynamic lists extracted from MEDICINES
const DOSAGE_FORMS = Array.from(new Set(MEDICINES.map((m) => m.form))).sort();
const MANUFACTURERS = Array.from(new Set(MEDICINES.map((m) => m.manufacturer))).sort();

const PRICE_TIERS = [
  { id: "all", label: "All prices" },
  { id: "under-50", label: "Under ₹50" },
  { id: "50-100", label: "₹50 - ₹100" },
  { id: "100-250", label: "₹100 - ₹250" },
  { id: "above-250", label: "Above ₹250" },
];

export function MedicinesExplorer() {
  const location = useApp((s) => s.location);
  const mounted = useMounted();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState(params.get("cat") ?? "all");
  const [rxFilter, setRxFilter] = useState<"all" | "rx" | "otc">("all");
  const [formFilter, setFormFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [priceTier, setPriceTier] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (cat !== "all") count++;
    if (rxFilter !== "all") count++;
    if (formFilter !== "all") count++;
    if (brandFilter !== "all") count++;
    if (priceTier !== "all") count++;
    if (minRating > 0) count++;
    if (!inStockOnly) count++;
    if (discountOnly) count++;
    return count;
  }, [cat, rxFilter, formFilter, brandFilter, priceTier, minRating, inStockOnly, discountOnly]);

  const resetAllFilters = () => {
    setCat("all");
    setRxFilter("all");
    setFormFilter("all");
    setBrandFilter("all");
    setPriceTier("all");
    setMinRating(0);
    setInStockOnly(true);
    setDiscountOnly(false);
    setSort("relevance");
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = MEDICINES.filter((m) => {
      // Category filter
      if (cat !== "all" && m.categoryId !== cat) return false;

      // Prescription filter
      if (rxFilter === "rx" && !m.requiresPrescription) return false;
      if (rxFilter === "otc" && m.requiresPrescription) return false;

      // Dosage form filter
      if (formFilter !== "all" && m.form !== formFilter) return false;

      // Brand / Manufacturer filter
      if (brandFilter !== "all" && m.manufacturer !== brandFilter) return false;

      // In stock filter
      if (inStockOnly && availableAts(m).length === 0) return false;

      // Discount filter
      if (discountOnly && m.price >= m.mrp) return false;

      // Rating filter
      if (minRating > 0 && m.rating < minRating) return false;

      // Price tier filter
      if (priceTier === "under-50" && m.price >= 50) return false;
      if (priceTier === "50-100" && (m.price < 50 || m.price > 100)) return false;
      if (priceTier === "100-250" && (m.price < 100 || m.price > 250)) return false;
      if (priceTier === "above-250" && m.price <= 250) return false;

      // Text query
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.generic.toLowerCase().includes(q) ||
        m.tags.some((t) => t.includes(q)) ||
        m.manufacturer.toLowerCase().includes(q) ||
        m.form.toLowerCase().includes(q)
      );
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "eta") list = [...list].sort((a, b) => (availableAts(a)[0]?.etaMin ?? 99) - (availableAts(b)[0]?.etaMin ?? 99));
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [query, cat, rxFilter, formFilter, brandFilter, priceTier, minRating, inStockOnly, discountOnly, sort]);

  const activeCategory = CATEGORIES.find((c) => c.id === cat);

  return (
    <div className="container-x py-10">
      {/* header */}
      <div className="anim-fade-up mb-8">
        <p className="text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">Medicines & health products</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Search the shelves near you</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
          Availability is synced from verified pharmacy inventory — what you see is what&apos;s on the shelf right now.
        </p>
      </div>

      {/* main toolbar */}
      <div className="card anim-fade-up mb-6 p-4 [animation-delay:80ms]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by medicine, salt or symptom — e.g. paracetamol, fever..."
              className="input-field !pl-10"
              aria-label="Search medicines"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Quick controls & All Filters trigger button */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* All Filters Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all",
                activeFilterCount > 0
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
              )}
              aria-label="Open filter drawer"
            >
              <SlidersHorizontal className="size-4 text-blue-600" />
              <span>All Filters</span>
              {activeFilterCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Quick Prescription Filter */}
            <select
              value={rxFilter}
              onChange={(e) => setRxFilter(e.target.value as typeof rxFilter)}
              className="input-field w-auto !py-2 text-xs font-semibold"
              aria-label="Prescription filter"
            >
              <option value="all">All medicines</option>
              <option value="otc">No prescription needed (OTC)</option>
              <option value="rx">Prescription Required (Rx)</option>
            </select>

            {/* Quick Sort Filter */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="input-field w-auto !py-2 text-xs font-semibold"
              aria-label="Sort results"
            >
              <option value="relevance">Most relevant</option>
              <option value="eta">Fastest delivery</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Highest rated</option>
            </select>

            {/* Quick In Stock Toggle */}
            <button
              onClick={() => setInStockOnly((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors",
                inStockOnly ? "border-green-300 bg-green-50 text-green-700" : "border-slate-200 text-slate-500 hover:bg-slate-50",
              )}
              aria-pressed={inStockOnly}
            >
              <CheckCircle2 className="size-4" /> In stock
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
          <button
            onClick={() => setCat("all")}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all",
              cat === "all"
                ? "border-blue-600 bg-blue-600 text-white shadow-[var(--shadow-cta)]"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700",
            )}
          >
            All Categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(cat === c.id ? "all" : c.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all",
                cat === c.id
                  ? "border-blue-600 bg-blue-600 text-white shadow-[var(--shadow-cta)]"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Active Filter Removable Tags / Chips */}
        {(activeFilterCount > 0 || query.trim()) && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Active Filters:</span>

            {query.trim() && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                Keyword: &quot;{query.trim()}&quot;
                <button onClick={() => setQuery("")} className="hover:text-red-600">
                  <X className="size-3" />
                </button>
              </span>
            )}

            {cat !== "all" && activeCategory && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                Category: {activeCategory.name}
                <button onClick={() => setCat("all")} className="hover:text-blue-900">
                  <X className="size-3" />
                </button>
              </span>
            )}

            {rxFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                {rxFilter === "rx" ? "Prescription Required (Rx)" : "No Prescription (OTC)"}
                <button onClick={() => setRxFilter("all")} className="hover:text-purple-900">
                  <X className="size-3" />
                </button>
              </span>
            )}

            {formFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Form: {formFilter}
                <button onClick={() => setFormFilter("all")} className="hover:text-emerald-900">
                  <X className="size-3" />
                </button>
              </span>
            )}

            {brandFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                Brand: {brandFilter}
                <button onClick={() => setBrandFilter("all")} className="hover:text-amber-900">
                  <X className="size-3" />
                </button>
              </span>
            )}

            {priceTier !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                Price: {PRICE_TIERS.find((p) => p.id === priceTier)?.label}
                <button onClick={() => setPriceTier("all")} className="hover:text-teal-900">
                  <X className="size-3" />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-800">
                Rating: {minRating}+ ★
                <button onClick={() => setMinRating(0)} className="hover:text-yellow-900">
                  <X className="size-3" />
                </button>
              </span>
            )}

            {!inStockOnly && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                Including Out of Stock
                <button onClick={() => setInStockOnly(true)} className="hover:text-orange-900">
                  <X className="size-3" />
                </button>
              </span>
            )}

            {discountOnly && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                On Sale / Discounted
                <button onClick={() => setDiscountOnly(false)} className="hover:text-rose-900">
                  <X className="size-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetAllFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <RotateCcw className="size-3" /> Reset all
            </button>
          </div>
        )}
      </div>

      {/* Serviceability Notice */}
      {mounted && !location.isServiceable && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs sm:text-sm text-amber-900">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-950">Service Currently Not Available in Your Location ({location.area})</p>
            <p className="mt-0.5 leading-relaxed text-amber-900">
              MedRelay delivers exclusively within <strong>Maharashtra, India</strong>. Products cannot be ordered from your current location and are shown as out of stock.
            </p>
          </div>
        </div>
      )}

      {/* Results header & count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          Showing <span className="font-bold text-slate-900">{results.length}</span> {results.length === 1 ? "product" : "products"}
          {query.trim() && (
            <>
              {" "}for <span className="font-bold text-blue-700">&ldquo;{query.trim()}&rdquo;</span>
            </>
          )}
          {" "}· verified pharmacy stock near {mounted ? location.area : "Maharashtra"}
        </p>
      </div>

      {/* Results grid or Empty State */}
      {results.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="No medicines match your filters"
          sub="Try resetting some filters or search for another medicine name, salt or symptom."
          action={
            <button onClick={resetAllFilters} className="btn-primary">
              Clear all filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((m) => (
            <MedicineCard key={m.id} medicine={m} />
          ))}
        </div>
      )}

      {/* Comprehensive Filter Modal / Slide-over Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Filter className="size-5 text-blue-600" />
                  <h2 className="font-display text-lg font-bold text-slate-900">Filter Medicines</h2>
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                      {activeFilterCount} active
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Close filters"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* 1. Category Filter */}
                <div>
                  <label className="mb-2.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCat("all")}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all",
                        cat === "all"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300",
                      )}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setCat(cat === c.id ? "all" : c.id)}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all truncate",
                          cat === c.id
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600 hover:border-slate-300",
                        )}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Prescription Status */}
                <div>
                  <label className="mb-2.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Prescription Requirement
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: "all", label: "All" },
                      { id: "otc", label: "OTC (No Rx)" },
                      { id: "rx", label: "Rx Required" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setRxFilter(item.id as typeof rxFilter)}
                        className={cn(
                          "flex-1 rounded-xl border py-2 text-center text-xs font-semibold transition-all",
                          rxFilter === item.id
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Dosage Form */}
                <div>
                  <label className="mb-2.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Dosage Form / Product Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFormFilter("all")}
                      className={cn(
                        "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
                        formFilter === "all"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      All Forms
                    </button>
                    {DOSAGE_FORMS.map((form) => (
                      <button
                        key={form}
                        onClick={() => setFormFilter(formFilter === form ? "all" : form)}
                        className={cn(
                          "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
                          formFilter === form
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50",
                        )}
                      >
                        {form}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Price Range */}
                <div>
                  <label className="mb-2.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRICE_TIERS.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setPriceTier(priceTier === tier.id ? "all" : tier.id)}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-center text-xs font-semibold transition-all",
                          priceTier === tier.id
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50",
                        )}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Brand / Manufacturer */}
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Brand / Manufacturer
                  </label>
                  <select
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    className="input-field text-xs font-semibold"
                  >
                    <option value="all">All Manufacturers & Brands</option>
                    {MANUFACTURERS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Customer Rating */}
                <div>
                  <label className="mb-2.5 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Minimum Rating
                  </label>
                  <div className="flex gap-2">
                    {[
                      { val: 0, label: "Any Rating" },
                      { val: 4.0, label: "4.0★ & above" },
                      { val: 4.5, label: "4.5★ & above" },
                    ].map((item) => (
                      <button
                        key={item.val}
                        onClick={() => setMinRating(item.val)}
                        className={cn(
                          "flex-1 rounded-xl border py-2 text-center text-xs font-semibold transition-all",
                          minRating === item.val
                            ? "border-amber-500 bg-amber-50 text-amber-800"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. Special Toggles */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Availability & Offers
                  </label>

                  <label className="flex items-center justify-between cursor-pointer rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="size-4 text-green-600" /> Show In-Stock Only
                    </span>
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="size-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <Tag className="size-4 text-rose-600" /> Discounted Items Only
                    </span>
                    <input
                      type="checkbox"
                      checked={discountOnly}
                      onChange={(e) => setDiscountOnly(e.target.checked)}
                      className="size-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50 gap-3">
                <button
                  onClick={resetAllFilters}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Reset All
                </button>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="btn-primary flex-1 !py-2.5 text-xs"
                >
                  Show {results.length} {results.length === 1 ? "Medicine" : "Medicines"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
