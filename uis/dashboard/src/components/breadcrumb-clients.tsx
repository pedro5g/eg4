import { Link, useLocation, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { cn } from "@/lib/utils";

export const BreadcrumbClients = () => {
  const { pathname } = useLocation();
  const clientCode = useParams()["clientCode"];

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const separatorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Breadcrumb>
        <BreadcrumbList>
          <motion.div variants={itemVariants}>
            <BreadcrumbItem>
              <BreadcrumbLink className="hover:text-blue-400" asChild>
                <Link
                  viewTransition
                  className={cn(
                    "text-base transition-colors duration-200",
                    pathname === "/clients" &&
                      "text-blue-500 hover:text-blue-500 font-semibold"
                  )}
                  to="/clients">
                  Registrar novo cliente
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </motion.div>

          <motion.div variants={separatorVariants}>
            <BreadcrumbSeparator
              className={cn(
                "transition-colors duration-200",
                pathname === "/clients/table" && "text-blue-500 font-semibold"
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <BreadcrumbItem>
              <BreadcrumbLink className="hover:text-blue-400" asChild>
                <Link
                  viewTransition
                  className={cn(
                    "text-base transition-colors duration-200",
                    pathname === "/clients/table" &&
                      "text-blue-500 hover:text-blue-500 font-semibold"
                  )}
                  to="/clients/table">
                  Tabela de Clientes
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </motion.div>

          <AnimatePresence mode="wait">
            {clientCode && (
              <motion.div
                key="client-profile"
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    duration: 0.4,
                    ease: "easeOut",
                  },
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                  scale: 0.9,
                  transition: {
                    duration: 0.2,
                    ease: "easeIn",
                  },
                }}
                className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { delay: 0.1, duration: 0.2 },
                  }}>
                  <BreadcrumbSeparator
                    className={cn(
                      "transition-colors duration-200",
                      clientCode && "text-blue-500 font-semibold"
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: 0.2, duration: 0.3 },
                  }}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className={cn(
                        "text-base hover:text-blue-400 transition-colors duration-200",
                        clientCode &&
                          "text-blue-500 hover:text-blue-500 font-semibold"
                      )}>
                      Perfil do cliente
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </BreadcrumbList>
      </Breadcrumb>
    </motion.div>
  );
};
