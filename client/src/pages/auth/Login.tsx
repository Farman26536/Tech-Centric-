import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const schema=z.object({email:z.string().trim().email('Enter a valid email address'),password:z.string().min(1,'Password is required')});
type Form=z.infer<typeof schema>;
export default function Login(){const {login}=useAuth();const nav=useNavigate();const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<Form>({resolver:zodResolver(schema)});const submit=async(d:Form)=>{try{await login(d.email,d.password);toast.success('Welcome back');nav('/dashboard',{replace:true})}catch(e:any){toast.error(e?.response?.data?.message||'Login failed. Please try again.')}};return <div className="grid min-h-screen place-items-center bg-slate-950 p-4"><form noValidate onSubmit={handleSubmit(submit)} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl" aria-labelledby="login-title"><div className="mb-8"><div className="text-2xl font-black text-brand-600">TeamFlow</div><h1 id="login-title" className="mt-4 text-3xl font-bold">Welcome back</h1><p className="mt-1 text-sm text-slate-500">Sign in to manage your team.</p></div><div className="space-y-4"><Input label="Email" type="email" autoComplete="email" {...register('email')} error={errors.email?.message}/><Input label="Password" type="password" autoComplete="current-password" {...register('password')} error={errors.password?.message}/><Button type="submit" loading={isSubmitting} className="w-full bg-brand-600 text-white hover:bg-brand-700">Sign in</Button></div><p className="mt-6 text-center text-sm text-slate-500">No account? <Link className="font-semibold text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500" to="/register">Create one</Link></p></form></div>}
