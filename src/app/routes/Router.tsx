import { BrowserRouter, Route, Routes } from "react-router";

import { USER_ROLE } from "@/entities";
import {
  ErrorPage,
  LoginPage,
  MainPage,
  MentorDashboardPage,
  MentorLoginPage,
  MentorMenteeProjectsPage,
  MyPage,
  ProjectDetailPage,
  UploadLoadingPage,
  UploadPage,
  UploadStepPage,
} from "@/pages";
import { ROUTE_PATHS } from "@/shared";
import { RootLayout } from "@/widgets";

import { ProtectedRoute } from "./components";

const MENTOR_ROUTE_ROLES = [USER_ROLE.MENTOR] as const;
const MENTEE_ROUTE_ROLES = [USER_ROLE.MENTEE] as const;
const PROJECT_DETAIL_ROUTE_ROLES = [
  USER_ROLE.MENTEE,
  USER_ROLE.MENTOR,
] as const;

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path={ROUTE_PATHS.MAIN} element={<MainPage />} />
          <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
          <Route
            path={ROUTE_PATHS.MENTOR_LOGIN}
            element={<MentorLoginPage />}
          />
          <Route
            path={ROUTE_PATHS.MENTOR_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={MENTOR_ROUTE_ROLES}>
                <MentorDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.MENTOR_MENTEE_PROJECTS}
            element={
              <ProtectedRoute allowedRoles={MENTOR_ROUTE_ROLES}>
                <MentorMenteeProjectsPage />
              </ProtectedRoute>
            }
          />

          <Route path={ROUTE_PATHS.NOT_FOUND} element={<ErrorPage />} />

          <Route
            path={ROUTE_PATHS.MYPAGE}
            element={
              <ProtectedRoute allowedRoles={MENTEE_ROUTE_ROLES}>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.FILE_UPLOAD}
            element={
              <ProtectedRoute allowedRoles={MENTEE_ROUTE_ROLES}>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.UPLOAD_LOADING}
            element={
              <ProtectedRoute allowedRoles={MENTEE_ROUTE_ROLES}>
                <UploadLoadingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.UPLOAD_STEP}
            element={
              <ProtectedRoute allowedRoles={MENTEE_ROUTE_ROLES}>
                <UploadStepPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE_PATHS.PROJECT_DETAIL}
            element={
              <ProtectedRoute allowedRoles={PROJECT_DETAIL_ROUTE_ROLES}>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
