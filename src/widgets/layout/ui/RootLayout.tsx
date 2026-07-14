import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";

import { Box, Flex } from "@chakra-ui/react";

import { ROUTE_PATHS, ScrollToTop } from "@/shared";

import { Footer, Header } from "../components";

export const RootLayout = () => {
  const location = useLocation();
  const isMainRoute = location.pathname === ROUTE_PATHS.MAIN;
  const isUploadStepRoute = location.pathname.startsWith(
    `${ROUTE_PATHS.UPLOAD_STEP_BASE}/`,
  );
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  useEffect(() => {
    if (!isMainRoute) {
      return;
    }

    let frameId: number | null = null;

    const updateHeaderState = () => {
      frameId = null;
      const scrollY = window.scrollY;

      setIsHeaderCollapsed((current) => {
        if (scrollY > 24) {
          return true;
        }

        if (scrollY < 8) {
          return false;
        }

        return current;
      });
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateHeaderState);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isMainRoute]);

  return (
    <Flex direction="column" minH="100dvh">
      <Flex
        direction="column"
        flex={1}
        maxW={isUploadStepRoute ? "100vw" : { base: "100vw", lg: "1280px" }}
        minH={0}
        w="100vw"
        mx="auto"
      >
        <Box
          flexShrink={0}
          h={isMainRoute && isHeaderCollapsed ? "0px" : "60px"}
          overflow="hidden"
          transition="height 260ms cubic-bezier(0.22, 1, 0.36, 1)"
        >
          <Box
            opacity={isMainRoute && isHeaderCollapsed ? 0 : 1}
            transform={
              isMainRoute && isHeaderCollapsed
                ? "translateY(-100%)"
                : "translateY(0)"
            }
            transition={[
              "opacity 220ms cubic-bezier(0.22, 1, 0.36, 1)",
              "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
            ].join(", ")}
            maxW={isUploadStepRoute ? { base: "100vw", lg: "1280px" } : "full"}
            mx="auto"
          >
            <ScrollToTop />
            <Header />
          </Box>
        </Box>
        <Box
          as="main"
          flex={1}
          minH={0}
          w="full"
          mx="auto"
          p={isUploadStepRoute ? 0 : "pagePadding"}
          overflowY={isUploadStepRoute || isMainRoute ? "visible" : "auto"}
        >
          <Outlet />
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
};
