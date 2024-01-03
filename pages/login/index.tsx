import { ReactElement, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { authService } from "../../services/auth.service";
import Head from "next/head";

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

interface LoginFormFields {
  password: string;
}

const Login = () => {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<LoginFormFields>();
  const [apiError, setApiError] = useState<Error | null>(null);
  const [isLockedOut, setIsLockedOut] = useState(false);
  //function for lockout mechanism for login rate limiting.
  const checkLockoutState = () => {
    const lockoutTime = localStorage.getItem("lockoutTime");
    if (lockoutTime) {
      const timePassed = new Date().getTime() - parseInt(lockoutTime);
      if (timePassed < LOCKOUT_DURATION_MS) {
        setIsLockedOut(true);
        const remainingTime = LOCKOUT_DURATION_MS - timePassed;
        setTimeout(() => {
          localStorage.removeItem("lockoutTime");
          localStorage.removeItem("failedAttempts");
          setIsLockedOut(false);
        }, remainingTime);
      } else {
        localStorage.removeItem("lockoutTime");
        localStorage.removeItem("failedAttempts");
        setIsLockedOut(false);
      }
    }
  };

  useEffect(() => {
    if (authService.isLogged) {
      router.push("/");
    }
    checkLockoutState();
  }, [router]);

  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    if (isLockedOut) {
      checkLockoutState(); // Recheck lockout state in case the lockout period has just expired
      return;
    }

    setApiError(null);

    try {
      await authService.useLogin(data.password);
      localStorage.removeItem("lockoutTime");
      localStorage.removeItem("failedAttempts");
      router.push("/");
    } catch (error) {
      setApiError(error as Error);
      const failedAttempts =
        parseInt(localStorage.getItem("failedAttempts") || "0") + 1;
      localStorage.setItem("failedAttempts", failedAttempts.toString());
      if (failedAttempts >= MAX_ATTEMPTS) {
        const currentTime = new Date().getTime();
        localStorage.setItem("lockoutTime", currentTime.toString());
        setIsLockedOut(true);
        setTimeout(() => {
          localStorage.removeItem("lockoutTime");
          localStorage.removeItem("failedAttempts");
          setIsLockedOut(false);
        }, LOCKOUT_DURATION_MS);
      }
    }
  };
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="logo.png" alt="Logo" className="w-40 mb-5 mt-20" />
      <div className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 max-w-xl">
        <h1 className="text-black font-semibold text-2xl">
          Connect to Validator Dashboard
        </h1>
        <p>
          Connect to your validator dashboard to see the performance of your
          node, check rewards and run maintenance tasks!
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("password")}
            placeholder="Password"
            type="password"
            className="block p-4 w-full bg-stone-200 text-stone-600 my-2"
            disabled={isLockedOut || formState.isSubmitting}
          ></input>
          {apiError && (
            <div className="flex text-red-500 items-center mb-5">
              <div className="ml-2 font-semibold">{apiError.message}</div>
            </div>
          )}
          {isLockedOut && (
            <div className="text-red-500 mb-5">
              Too many failed attempts. Try again in 30 minutes.
            </div>
          )}
          <button
            disabled={isLockedOut || formState.isSubmitting}
            className="btn btn-primary"
            type="submit"
          >
            {formState.isSubmitting ? (
              <ArrowPathIcon className="w-5 spinner" />
            ) : (
              "Connect"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Shardeum Dashboard</title>
        <meta
          name="description"
          content="Dashboard to configure a Shardeum validator"
        />
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid justify-center">{page}</div>
    </>
  );
};

export default Login;
