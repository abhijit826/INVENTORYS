import { ErrorMessage, Field, Formik } from 'formik'
import { Button } from 'primereact/button' 
import { useRef } from 'react' 
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useLoginUserMutation } from '../provider/queries/Auth.query'
import { toast } from 'sonner'
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [LoginUser, LoginUserResponse] = useLoginUserMutation()
  const navigate = useNavigate()
  
  type User = {
    token: string,
    email: string,
    password: string
  }

  //@ts-ignore
  const RecaptchaRef = useRef<any>();

  const initialValues: User = {
    token: '',
    email: '',
    password: ''
  }

  const validationSchema = yup.object({
    email: yup.string().email("Email must be valid").required("Email is required"),
    password: yup.string().min(5, "Password must be greater than 5 characters").required("Password is required"),
  })

  const OnSubmitHandler = async (e: User, { resetForm }: any) => {
    try {
      const { data, error }: any = await LoginUser(e)
      if (error) {
        toast.error(error.data.message);
        return
      }

      localStorage.setItem("token", data.token);

      resetForm()
      navigate("/")
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      RecaptchaRef.current.reset();
    }
  }

  return (
    <div 
      className='min-h-screen flex items-center justify-center bg-cover bg-center' 
      style={{ backgroundImage: `url('https://www.echelonedge.com/wp-content/uploads/2023/05/Network-Inventory-Management.png')` }} 
    >
      <div className="w-full max-w-lg bg-white shadow-xl rounded-lg p-8">
        {/* Header Section */}
        <h1 className="text-4xl font-bold text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-indigo-600 to-pink-600 mb-8">
          INVENTORY MANAGEMENT SYSTEM
        </h1>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={OnSubmitHandler}>
          {({ values, setFieldValue, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email Field */}
              <div className="flex flex-col">
                <label htmlFor="email" className="font-medium text-gray-700 mb-2">Email</label>
                <Field 
                  id="email" 
                  name="email" 
                  className="input-field p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Enter your email address" 
                />
                <ErrorMessage component="p" className="text-red-500 text-sm mt-1" name="email" />
              </div>

              {/* Password Field */}
              <div className="flex flex-col">
                <label htmlFor="password" className="font-medium text-gray-700 mb-2">Password</label>
                <Field 
                  id="password" 
                  name="password" 
                  className="input-field p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Enter your password" 
                  type="password" 
                />
                <ErrorMessage component="p" className="text-red-500 text-sm mt-1" name="password" />
              </div>

              {/* ReCAPTCHA */}
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={RecaptchaRef}
                  sitekey={import.meta.env.VITE_SITE_KEY}
                  onChange={(e) => setFieldValue('token', e)}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button 
                  disabled={!values.token} 
                  loading={LoginUserResponse.isLoading} 
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg text-lg shadow-lg hover:bg-indigo-700 transition duration-300  flex items-center justify-center"
                >
                  Login
                </Button>
              </div>

              {/* Footer Links */}
              <div className="flex justify-between text-sm mt-4">
                <p className="text-gray-500">Don't have an account? <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Register</Link></p>
                <p className="text-gray-500">Forgot <Link to="#" className="font-semibold text-indigo-600 hover:text-indigo-700">Password?</Link></p>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Login
