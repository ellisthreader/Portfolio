import React from "react";
import CodingTerminal from "@/Components/CodingTerminal";
import ShapePlayground from "@/Components/ShapePlayground";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="w-full px-6 py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      <h2 className="text-4xl font-bold text-center mb-16 dark:text-white">
        Skills
      </h2>

      {/* Coding */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h3 className="text-2xl font-semibold mb-4 dark:text-white">💻 Coding</h3>
          <p className="text-lg leading-relaxed dark:text-gray-300">
            I have a strong foundation in HTML, CSS, and JavaScript, with
            experience using modern frontend frameworks such as React, Vue, and
            Angular. On the backend, I work with Node.js, Express, Django, and
            Flask. I am proficient in managing databases including both SQL
            (PostgreSQL, MySQL) and NoSQL (MongoDB, Firebase). I also use Git with
            platforms like GitHub and GitLab for version control and collaboration.
          </p>
        </div>
        <div className="flex justify-center">
          <CodingTerminal />
        </div>
      </div>

      {/* Design & UX with interactive Shape Playground */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="flex flex-col items-center gap-8 order-2 md:order-1">
          <ShapePlayground />
        </div>
        <div className="order-1 md:order-2">
          <h3 className="text-2xl font-semibold mb-4 dark:text-white">
            🎨 Design & User Experience
          </h3>
          <p className="text-lg leading-relaxed dark:text-gray-300">
            I specialize in creating responsive, accessible designs with a focus on
            strong UI/UX principles. I have experience using design tools such as
            Figma, Adobe XD, and Sketch for prototyping, and I build modern,
            user-friendly interfaces with frameworks like Tailwind, Bootstrap, and
            Material UI.
          </p>
        </div>
      </div>

      {/* Professional Skills */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h3 className="text-2xl font-semibold mb-4 dark:text-white">
            🤝 Professional Skills
          </h3>
          <p className="text-lg leading-relaxed dark:text-gray-300">
            I bring strong problem-solving abilities, applying creative debugging
            and logical thinking to overcome challenges. I am experienced in
            project management, working with Agile and Scrum methodologies and
            using tools like Trello, Jira, and Notion to stay organized. I thrive
            in collaboration, working effectively with designers, developers, and
            clients, and excel in communication by writing clear documentation and
            explaining technical concepts. Additionally, I manage my time
            efficiently to deliver projects on schedule.
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80"
            alt="Professional Skills"
            className="w-full max-w-md rounded-lg shadow-lg dark:shadow-gray-700"
          />
        </div>
      </div>

      {/* Technical Skills */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center order-2 md:order-1">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
            alt="Technical Skills"
            className="w-full max-w-md rounded-lg shadow-lg dark:shadow-gray-700"
          />
        </div>
        <div className="order-1 md:order-2">
          <h3 className="text-2xl font-semibold mb-4 dark:text-white">
            ⚙️ Technical Skills
          </h3>
          <p className="text-lg leading-relaxed dark:text-gray-300">
            Beyond core web development, I have experience with data
            visualization using D3.js, Chart.js, and Recharts, as well as a
            foundational understanding of machine learning with scikit-learn and
            TensorFlow. I also explore mobile development with React Native and
            Flutter, and enjoy building interactive experiences with tools such as
            Three.js, p5.js, and Unity.
          </p>
        </div>
      </div>
    </section>
  );
}
