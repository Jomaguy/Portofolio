import { motion } from "framer-motion";

export default function Services() {
  return (
    <div className="container py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center"
      >
        <h1 className="text-4xl font-bold tracking-tighter mb-6 md:text-5xl lg:text-6xl">
          Services
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
          Coming Soon
        </p>
      </motion.div>
    </div>
  );
} 