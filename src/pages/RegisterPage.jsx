import RegisterForm from "../components/RegisterForm.jsx";

function RegisterPage() {
  return (
    <div className="text-center w-full">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">
        Create an account
      </h1>
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
