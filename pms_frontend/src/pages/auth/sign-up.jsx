import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { usePopup } from "@/context/PopupContext.jsx";
import { sendData } from "@/utils/helpers.js";
import { servers } from "@/configs/server_api.js";
import { useState } from "react";

export function SignUp() {
  const { showPopup } = usePopup();
  const [loader, setLoader] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      showPopup("Passwords do not match. Please try again.");
      return;
    }

    try {
      setLoader(true);
      const result = await sendData(`${servers.default}/auth/register`, data, "");
      if (result.error) {
        showPopup(result.error);
      } else {
        showPopup(result.message);
        setTimeout(() => {
          window.location = "/auth/sign-in";
        }, 3000);
      }
    } catch (error) {
      showPopup(error.message);
    } finally {
      setLoader(false);
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
      <section className="m-4 h-[90vh] flex">
        <div className="w-2/5  hidden lg:block">
          <img
              src="/img/pattern.png"
              className="h-full w-full object-cover rounded-3xl"
          />
        </div>
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
            <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your information to register.</Typography>
          </div>
          <form onSubmit={handleSubmit} className="mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-1 flex flex-col gap-3">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                First Name
              </Typography>
              <Input
                  size="lg"
                  placeholder="Anna"
                  onChange={handleOnChange}
                  name="firstName"
                  type="text"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />

              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Last Name
              </Typography>
              <Input
                  size="lg"
                  placeholder="Mukahigiro"
                  onChange={handleOnChange}
                  name="lastName"
                  type="text"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />

              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your Email
              </Typography>
              <Input
                  size="lg"
                  placeholder="name@mail.com"
                  onChange={handleOnChange}
                  name="email"
                  type="email"

                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />

              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your Phone Number
              </Typography>
              <Input
                  size="lg"
                  placeholder="250 787 ... ..."
                  onChange={handleOnChange}
                  name="phone"
                  type="tel"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />

              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your Password
              </Typography>
              <Input
                  size="lg"
                  placeholder="*******"
                  onChange={handleOnChange}
                  name="password"
                  type="password"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              <Typography variant="small" color="gray" className="text-xs mt-[-12px]">
                Must be 8+ characters with uppercase, lowercase, number, and special character.
              </Typography>

            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Confirm Password
              </Typography>
              <Input
                  size="lg"
                  placeholder="Retype your password"
                  onChange={handleOnChange}
                  name="confirmPassword"
                  type="password"

                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />
            </div>

            <Checkbox
                label={
                  <Typography
                      variant="small"
                      color="gray"
                      className="flex items-center justify-start font-medium"
                  >
                    I agree to the&nbsp;
                    <a
                        href="#"
                        className="font-normal text-black transition-colors hover:text-gray-900 underline"
                    >
                      Terms and Conditions
                    </a>
                  </Typography>
                }
                required
                containerProps={{ className: "-ml-2.5" }}
            />
            </div>
            <Button className="mt-6" fullWidth type="submit" disabled={loader}>
              {loader ? "Registering..." : "Register Now"}
            </Button>

            <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
              Already have an account?
              <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
            </Typography>
          </form>
        </div>
      </section>
  );
}

export default SignUp;
