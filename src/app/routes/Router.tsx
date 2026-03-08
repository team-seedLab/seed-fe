import { BrowserRouter, Route, Routes } from "react-router";

import { ErrorPage, MainPage, MyPage } from "@/pages";
import { ROUTE_PATHS } from "@/shared";
import { RootLayout } from "@/widgets";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path={ROUTE_PATHS.MAIN} element={<MainPage />} />
          <Route path={ROUTE_PATHS.MYPAGE} element={<MyPage />} />

          <Route path={ROUTE_PATHS.NOT_FOUND} element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
