// HeroSection.tsx
import { HiHand } from "react-icons/hi";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { HiLocationMarker, HiPhone } from "react-icons/hi";

export default function HeroSection() {
  const socialIcons = [
    { icon: FaLinkedin, url: "https://www.linkedin.com/in/ellis-threader-25036b320/" },
    { icon: FaGithub, url: "https://github.com/ellisthreader" },
    { icon: FaTwitter, url: "https://x.com/Mighty90000" },
    { icon: FaInstagram, url: "https://www.instagram.com/e_llis1/?hl=en" },
  ];

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 gap-6
      bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100
      dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black
      text-gray-900 dark:text-gray-100 transition-colors duration-500"
    >
      <h1 className="text-6xl font-extrabold md:text-7xl flex items-center justify-center gap-4
        bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
        dark:from-blue-400 dark:via-purple-400 dark:to-pink-400"
      >
        <motion.span
          animate={{ rotate: [0, 15, -15, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="inline-block"
        >
          <HiHand className="text-yellow-400" />
        </motion.span>
        Ellis Threader
      </h1>


      <p className="mt-2 md:text-xl flex items-center justify-center gap-4 text-gray-700 dark:text-gray-300">
        <HiLocationMarker className="text-red-500" /> Chelmsford, Essex <HiPhone className="text-green-500" /> +44 7853 077766
      </p>


      <p className="mt-4 mb-6 text-xl md:text-2xl max-w-2xl">
        A developer specializing in modern web applications with <span className="font-semibold text-blue-600 dark:text-blue-400">Laravel</span> and <span className="font-semibold text-green-600 dark:text-green-400">React</span>.
      </p>

      {/* Social Icons */}
      <div className="flex gap-6 mb-6 text-3xl">
        {socialIcons.map(({ icon: Icon, url }, index) => (
          <motion.a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            whileHover={{ scale: 1.3, y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon />
          </motion.a>
        ))}
      </div>

      {/* Profile Image with float animation */}
      <motion.div
        className="w-96 h-96"
        animate={{ y: [0, -15, 0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <img
          src="/images/profile.jpg"
          alt="Ellis Threader"
          className="w-full h-full object-cover rounded-full border-4 border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-700"
        />
      </motion.div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C600,120 600,0 1200,120 L1200,0 L0,0 Z"
            className="fill-current text-white dark:text-gray-900"
          />
        </svg>
      </div>
    </section>
  );
}
