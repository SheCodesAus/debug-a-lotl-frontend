import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <div className="text-center w-full">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">
        This is the login page.
      </h1>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
