import React, { useEffect, useRef, useState } from "react";
import {
  Engine,
  Render,
  World,
  Bodies,
  Body,
  Runner,
  Mouse,
  MouseConstraint,
  Vector,
} from "matter-js";

type ShapeType = "circle" | "square" | "rectangle" | "triangle";

type Shape = {
  id: number;
  type: ShapeType;
  color: string;
  size: number;
  body?: Body;
};

const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#F43F5E"];

export default function ShapePlayground() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [showSettings, setShowSettings] = useState(true);
  const [activeShapeId, setActiveShapeId] = useState<number | null>(null);
  const [selectedShape, setSelectedShape] = useState<ShapeType>("rectangle");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [selectedSize, setSelectedSize] = useState(60);

  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Engine.create());
  const mouseRef = useRef({ x: 0, y: 0 });

  // Setup Matter.js world
  useEffect(() => {
    const engine = engineRef.current;
    const world = engine.world;

    if (!sceneRef.current) return;

    const width = 700;
    const height = 450;

    const render = Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
      },
    });

    const walls = [
      Bodies.rectangle(width / 2, height, width, 20, { isStatic: true }),
      Bodies.rectangle(width / 2, 0, width, 20, { isStatic: true }),
      Bodies.rectangle(0, height / 2, 20, height, { isStatic: true }),
      Bodies.rectangle(width, height / 2, 20, height, { isStatic: true }),
    ];
    World.add(world, walls);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    World.add(world, mouseConstraint);
    render.mouse = mouse;

    render.canvas.addEventListener("mousemove", (e) => {
      const rect = render.canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  const addShape = () => {
    if (shapes.length >= 10) return;

    const engine = engineRef.current;
    const world = engine.world;

    let body;
    switch (selectedShape) {
      case "circle":
        body = Bodies.circle(350, 50, selectedSize / 2, { restitution: 0.5 });
        break;
      case "square":
        body = Bodies.rectangle(350, 50, selectedSize, selectedSize, { restitution: 0.5 });
        break;
      case "rectangle":
        body = Bodies.rectangle(350, 50, selectedSize * 1.5, selectedSize, { restitution: 0.5 });
        break;
      case "triangle":
        body = Bodies.polygon(350, 50, 3, selectedSize, { restitution: 0.5 });
        break;
    }

    if (body) {
      const newShape: Shape = {
        id: Date.now(),
        type: selectedShape,
        color: selectedColor,
        size: selectedSize,
        body,
      };
      setShapes((prev) => [...prev, newShape]);
      setActiveShapeId(newShape.id);
      World.add(world, body);
    }
  };

  const removeShape = () => {
    if (shapes.length === 0) return;

    const engine = engineRef.current;
    const world = engine.world;

    const lastShape = shapes[shapes.length - 1];
    if (lastShape.body) {
      World.remove(world, lastShape.body);
    }
    setShapes((prev) => prev.slice(0, prev.length - 1));
  };

  // Hover-based responsive physics
  useEffect(() => {
    const interval = setInterval(() => {
      shapes.forEach((shape) => {
        if (!shape.body) return;

        const pos = shape.body.position;
        const mousePos = mouseRef.current;

        const dx = mousePos.x - pos.x;
        const dy = mousePos.y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) { // smaller radius for hover effect
          const force = 0.0015; // smaller, smoother push
          const direction = Vector.normalise({ x: dx, y: dy });
          Body.applyForce(shape.body, pos, Vector.mult(direction, force));

          const maxVel = 8;
          Body.setVelocity(shape.body, {
            x: Math.max(Math.min(shape.body.velocity.x, maxVel), -maxVel),
            y: Math.max(Math.min(shape.body.velocity.y, maxVel), -maxVel),
          });
        }

        // Add subtle air friction to stabilize motion
        shape.body.frictionAir = 0.05;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [shapes]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Settings menu */}
      <div className="w-[700px] bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg flex flex-wrap gap-4 items-center justify-between">
        {/* Shape */}
        <div>
          <label className="block mb-1 text-sm font-medium dark:text-white">Shape:</label>
          <select
            value={selectedShape}
            onChange={(e) => setSelectedShape(e.target.value as ShapeType)}
            className="p-2 rounded border dark:bg-gray-700 dark:text-white"
          >
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="rectangle">Rectangle</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>

        {/* Colour */}
        <div>
          <label className="block mb-1 text-sm font-medium dark:text-white">Colour:</label>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                className={`w-8 h-8 rounded-full border-2 border-gray-300 ${
                  selectedColor === color ? "ring-2 ring-black" : ""
                }`}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="block mb-1 text-sm font-medium dark:text-white">Size:</label>
          <input
            type="range"
            min={20}
            max={120}
            value={selectedSize}
            onChange={(e) => setSelectedSize(Number(e.target.value))}
          />
        </div>

        {/* Add / Remove */}
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={addShape}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
          <button
            onClick={removeShape}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Playground */}
      <div
        ref={sceneRef}
        className="relative w-[700px] h-[450px] border-2 border-dashed border-gray-400 rounded-lg bg-transparent"
      />
    </div>
  );
}
