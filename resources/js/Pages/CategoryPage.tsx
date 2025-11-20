import React from 'react';

interface CategoryPageProps {
  category: string;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  return (
    <div className="min-h-screen flex items-start justify-center pt-32 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-6xl font-bold uppercase text-gray-900 dark:text-white">
        {category}
      </h1>
    </div>
  );
}
