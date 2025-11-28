import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Products({ categories, auth }: any) {
  console.log("🔥 Categories passed:", categories);

  const [name, setName] = useState("");
  const { post, delete: destroy, processing } = useForm();

  const addCategory = (e: any) => {
    e.preventDefault();
    post("/admin/categories", {
      data: { name },
      onSuccess: () => setName(""),
    });
  };

  const removeCategory = (id: number) => {
    destroy(`/admin/categories/${id}`);
  };

  // -------------------------------
  // ⭐ 1. FILTER ONLY KIDS CATEGORIES  
  // -------------------------------
  const kidsCategories = categories.filter(
    (cat: any) =>
      ["baby-newborn", "2-8", "9-14"].includes(cat.age_group?.toLowerCase())
  );

  // -------------------------------
  // ⭐ 2. GROUP BY AGE GROUP  
  // -------------------------------
  const groupedByAge = kidsCategories.reduce((acc: any, cat: any) => {
    const age = cat.age_group || "Unknown Age Group";
    if (!acc[age]) acc[age] = [];
    acc[age].push(cat);
    return acc;
  }, {});

  // -------------------------------
  // ⭐ 3. Inside each AGE group → group by section (Boy/Girl)
  // -------------------------------
  const groupBySection = (items: any[]) => {
    const map: any = {};
    items.forEach((cat) => {
      const sec = cat.section || "Unknown Section";
      if (!map[sec]) map[sec] = [];
      map[sec].push(cat);
    });
    return map;
  };

  // -------------------------------
  // ⭐ 4. Inside each SECTION → group by subsection (Clothing/Shoes/etc.)
  // -------------------------------
  const groupBySubsection = (items: any[]) => {
    const map: any = {};
    items.forEach((cat) => {
      const sub = cat.subsection || "Other";
      if (!map[sub]) map[sub] = [];
      map[sub].push(cat);
    });
    return map;
  };

  // OPEN STATES
  const [openAge, setOpenAge] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-10">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-900 dark:text-white">
          Manage Kids Categories
        </h1>

        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">

          {/* ADD CATEGORY */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Add Category
          </h2>

          <form onSubmit={addCategory} className="flex gap-3 mb-10">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Category name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              disabled={processing}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </form>

          {/* KIDS HIERARCHY */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Kids Categories
          </h2>

          <div className="space-y-5">
            {Object.keys(groupedByAge).map((age) => {
              const ageSections = groupBySection(groupedByAge[age]);

              return (
                <div
                  key={age}
                  className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl shadow"
                >
                  {/* AGE GROUP HEADER */}
                  <button
                    onClick={() => {
                      setOpenAge(openAge === age ? null : age);
                      setOpenSection(null);
                      setOpenSub(null);
                    }}
                    className="w-full flex justify-between items-center p-5 text-xl font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    {age.replace("-", " ").toUpperCase()}
                    <span
                      className={`transition transform ${
                        openAge === age ? "rotate-90" : ""
                      }`}
                    >
                      ▶
                    </span>
                  </button>

                  {/* SECTIONS (Boy/Girl) */}
                  {openAge === age && (
                    <div className="px-6 pb-4 space-y-3">
                      {Object.keys(ageSections).map((section) => {
                        const subsections = groupBySubsection(
                          ageSections[section]
                        );

                        return (
                          <div key={section}>
                            <button
                              onClick={() =>
                                setOpenSection(
                                  openSection === section ? null : section
                                )
                              }
                              className="w-full flex justify-between items-center p-3 text-lg bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                              {section}
                              <span
                                className={`transition transform ${
                                  openSection === section ? "rotate-90" : ""
                                }`}
                              >
                                ▶
                              </span>
                            </button>

                            {/* SUBSECTIONS */}
                            {openSection === section && (
                              <div className="ml-6 mt-2 space-y-2">
                                {Object.keys(subsections).map((sub) => (
                                  <div key={sub}>
                                    <button
                                      onClick={() =>
                                        setOpenSub(openSub === sub ? null : sub)
                                      }
                                      className="w-full flex justify-between items-center p-3 text-md bg-gray-200 dark:bg-gray-600 rounded-xl text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                                    >
                                      {sub}
                                      <span
                                        className={`transition transform ${
                                          openSub === sub ? "rotate-90" : ""
                                        }`}
                                      >
                                        ▶
                                      </span>
                                    </button>

                                    {/* FINAL CATEGORY LIST */}
                                    {openSub === sub && (
                                      <div className="ml-6 mt-2 space-y-2">
                                        {subsections[sub].map((cat: any) => (
                                          <div
                                            key={cat.id}
                                            className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl"
                                          >
                                            <div>
                                              <p className="font-medium text-gray-900 dark:text-white">
                                                {cat.name}
                                              </p>
                                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                Slug: {cat.slug}
                                              </p>
                                            </div>
                                            <button
                                              onClick={() =>
                                                removeCategory(cat.id)
                                              }
                                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
