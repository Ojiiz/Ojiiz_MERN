import React, { useState, useEffect } from "react";

import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  CheckOut,
  ChoosePlan,
  ForgotPassword,
  Home,
  JobDetail,
  JobPages,
  OverView,
  PasswordChange,
  Payment,
  Plan,
  Profile,
  ResetPassword,
  SignIn,
  SignUp,
  DeactivateAccount,
  SavedJobs,
  SuccessPage,
  ErrorPage,
  ExportCsv
} from "./pages";
import { ScrollToTop } from "./components";
import { useAuthContext } from "./hooks/useAuthContext";
import { useAdminAuthContext } from "./hooks/useAdminAuthContext";
import { AdminHome, AdminJobs, AdminLogin, AdminPasswordChange, Client, User } from "./admin/pages";

const App = () => {
  const { ojiiz_user, loading: userLoading } = useAuthContext();
  const [authChecked, setAuthChecked] = useState(false);
  const { ojiiz_admin, loading: AdminLoading } = useAdminAuthContext();

  useEffect(() => {
    if (!userLoading || !AdminLoading) {
      setAuthChecked(true);
    }
  }, [userLoading, AdminLoading]);

  if (!authChecked) {
    // Hier kann bei Bedarf ein Ladeindikator angezeigt werden
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* accounts routes */}

        <Route path="/success/:session_id" element={<SuccessPage />} />
        <Route path="/cancel" element={<ErrorPage />} />

        {/* sign-up */}
        <Route path="/sign-up" element={!ojiiz_user ? (
          <SignUp />
        ) : (
          <Navigate to="/" />
        )} />

        {/* for sign-In */}
        <Route path="/sign-in" element={!ojiiz_user ? (
          <SignIn />
        ) : (
          <Navigate to="/" />
        )} />

        {/* for Price*/}
        <Route path="/price" element={!ojiiz_user ? (
          <Plan />
        ) : (
          <Navigate to="/" />
        )} />

        {/* for Check-out */}
        <Route path="/checkout" element={!ojiiz_user ? (
          <CheckOut />
        ) : (
          <Navigate to="/" />
        )} />

        {/* for forgot-password */}
        <Route path="/forgot-password" element={!ojiiz_user ? (
          <ForgotPassword />
        ) : (
          <Navigate to="/" />
        )} />

        {/* for reset-password */}
        <Route path="/reset-password" element={!ojiiz_user ? (
          <ResetPassword />
        ) : (
          <Navigate to="/" />
        )} />

        {/* Authenticated routes */}

        {/* for profile-password */}
        <Route path="/profile" element={ojiiz_user ? (
          <Profile />
        ) : (
          <Navigate to="/" />
        )} />

        {/* for password-change */}
        <Route path="/password-change" element={ojiiz_user ? (
          <PasswordChange />
        ) : (
          <Navigate to="/" />
        )} />

        {/* for deactive-account */}
        <Route path="/deactivate-account" element={ojiiz_user ? (
          <DeactivateAccount />
        ) : (
          <Navigate to="/" />
        )} />


        {/* home/landing pages */}

        {/* for Home Page */}
        <Route path="/" element={ojiiz_user ? (
          <Home />
        ) : (
          <Navigate to="/sign-in" />
        )} />

        {/* for jobs Page */}
        <Route path="/jobs" element={ojiiz_user ? (
          <JobPages />
        ) : (
          <Navigate to="/sign-in" />
        )} />

        {/* for jobs-detail Page */}
        <Route path="/jobs-detail/:id" element={ojiiz_user ? (
          <JobDetail />
        ) : (
          <Navigate to="/sign-in" />
        )} />

        {/* for overview Page */}
        <Route path="/overview" element={ojiiz_user ? (
          <OverView />
        ) : (
          <Navigate to="/sign-in" />
        )} />

        {/* for choose-plan Page */}
        <Route path="/choose-plan" element={ojiiz_user ? (
          <ChoosePlan />
        ) : (
          <Navigate to="/sign-in" />
        )} />

        {/* for payment Page */}
        <Route path="/export-csv" element={ojiiz_user ? (
          <ExportCsv />
        ) : (
          <Navigate to="/sign-in" />
        )} />

        {/* for payment Page */}
        <Route path="/payment" element={ojiiz_user ? (
          <Payment />
        ) : (
          <Navigate to="/sign-in" />
        )} />

        {/* for saved-jobs Page */}
        <Route path="/saved-jobs" element={ojiiz_user ? (
          <SavedJobs />
        ) : (
          <Navigate to="/sign-in" />
        )} />


        {/* admin pannel */}
        {/* admin-login */}
        <Route path="/admin-login" element={!ojiiz_admin ? (
          <AdminLogin />
        ) : (
          <Navigate to="/admin" />
        )} />

        <Route path="/export-csv" element={!ojiiz_admin ? (
          <ExportCsv />
        ) : (
          <Navigate to="/admin" />
        )} />

        {/* admin-auth pages */}
        <Route path="/admin" element={ojiiz_admin ? (
          <AdminHome />
        ) : (
          <Navigate to="/admin-login" />
        )} />

        <Route path="/client" element={ojiiz_admin ? (
          <Client />
        ) : (
          <Navigate to="/admin-login" />
        )} />

        <Route path="/admin-jobs" element={ojiiz_admin ? (
          <AdminJobs />
        ) : (
          <Navigate to="/admin-login" />
        )} />

        <Route path="/user" element={ojiiz_admin ? (
          <User />
        ) : (
          <Navigate to="/admin-login" />
        )} />


        <Route path="/admin-profile" element={ojiiz_admin ? (
          <AdminPasswordChange />
        ) : (
          <Navigate to="/admin-login" />
        )} />


      </Routes>
    </BrowserRouter>
  );
};

export default App;

