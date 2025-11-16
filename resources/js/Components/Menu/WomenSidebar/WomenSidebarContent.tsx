import React from "react";

export default function WomenSidebarContent() {
  const featuredItems = [
    { img: "/images/item1.jpg", title: "Summer Dress" },
    { img: "/images/item2.jpg", title: "Sneakers" },
    { img: "/images/item3.jpg", title: "Handbag" },
    { img: "/images/item4.jpg", title: "Accessories" },
    { img: "/images/item5.jpg", title: "Jacket" },
  ];

  return (
    <div className="flex flex-col h-full text-gray-700 dark:text-gray-200">
      <div className="flex gap-6">
        {/* Left Column */}
        <div className="flex flex-col flex-1 justify-between">
          <div className="space-y-6">
            {/* Big Headings */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold uppercase hover:underline cursor-pointer">
                BEST SELLERS
              </h2>
              <h2 className="text-2xl font-bold uppercase hover:underline cursor-pointer">
                NEW IN
              </h2>
              <h2 className="text-2xl font-bold uppercase hover:underline cursor-pointer">
                SALE
              </h2>
            </div>

            {/* Smaller Links */}
            <div className="space-y-1 mt-4">
              <a href="#" className="block uppercase text-sm hover:underline">
                Clothing
              </a>
              <a href="#" className="block uppercase text-sm hover:underline">
                Shoes
              </a>
              <a href="#" className="block uppercase text-sm hover:underline">
                Accessories
              </a>
              <a href="#" className="block uppercase text-sm hover:underline">
                Brands (A-Z)
              </a>
            </div>
          </div>

          {/* Bottom Section (always visible) */}
          <div className="space-y-1 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <a href="#" className="block uppercase text-sm hover:underline">
              CUSTOMER SERVICE
            </a>
            <a href="#" className="block uppercase text-sm hover:underline">
              Privacy & Legal
            </a>
            <a href="#" className="block uppercase text-sm hover:underline">
              NEWSLETTER
            </a>
            <a href="#" className="block uppercase text-sm hover:underline">
              CHANGE REGION
            </a>
          </div>
        </div>

        {/* Right Column: Photos (static, no scroll) */}
        <div className="w-48 flex-shrink-0 space-y-4">
          {featuredItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-full h-28 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-1 text-xs text-center">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
