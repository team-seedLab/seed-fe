import { BrowserRouter, Route, Routes } from "react-router";

import {
  ErrorPage,
  LoginPage,
  MainPage,
  MyPage,
  ProjectDetailPage,
  UploadCompletePage,
  UploadLoadingPage,
  UploadPage,
  UploadStepPage,
} from "@/pages";
import { ROUTE_PATHS } from "@/shared";
import { RootLayout } from "@/widgets";

import { ProtectedRoute } from "./components";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path={ROUTE_PATHS.MAIN} element={<MainPage />} />
          <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />

          <Route path={ROUTE_PATHS.NOT_FOUND} element={<ErrorPage />} />

          <Route
            path={ROUTE_PATHS.MYPAGE}
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.FILE_UPLOAD}
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.UPLOAD_LOADING}
            element={
              <ProtectedRoute>
                <UploadLoadingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.UPLOAD_STEP}
            element={
              <ProtectedRoute>
                <UploadStepPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.UPLOAD_COMPLETE}
            element={
              <ProtectedRoute>
                <UploadCompletePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.PROJECT_DETAIL}
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
