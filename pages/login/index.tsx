import { ReactElement, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { FieldValues, useForm } from "react-hook-form";
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
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  useEffect(() => {
    if (authService.isLogged) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isLockedOut) {
      timeoutId = setTimeout(() => {
        setIsLockedOut(false);
        setFailedAttempts(0);
      }, LOCKOUT_DURATION_MS);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLockedOut]);

  const onSubmit = async (data: { password: string }) => {
    if (isLockedOut) {
      return;
    }

    setApiError(null);

    try {
      await authService.useLogin(data.password);
      router.push("/");
    } catch (error) {
      setApiError(error as Error);
      setFailedAttempts((prev) => prev + 1);
      if (failedAttempts + 1 >= MAX_ATTEMPTS) {
        setIsLockedOut(true);
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
