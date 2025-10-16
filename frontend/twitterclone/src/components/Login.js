import React, { useEffect, useState } from 'react';
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import { getUser } from '../redux/userSlice';

const Login = () => {
  // views: landing | login (modal) | signup
  const [view, setView] = useState('landing');
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // sign-in modal state
  const [identifier, setIdentifier] = useState("");
  // step can be 'id' or 'password'
  const [loginStep, setLoginStep] = useState('id');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = view === 'login';
  const isSignup = view === 'signup';

  const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.928 31.91 29.318 35 24 35c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.1 0 5.94 1.1 8.16 2.91l5.66-5.66C34.9 3.14 29.7 1 24 1 11.85 1 2 10.85 2 23s9.85 22 22 22 22-9.85 22-22c0-1.47-.15-2.9-.389-4.25z"/>
      <path fill="#FF3D00" d="M6.305 14.691l6.571 4.819C14.335 16.163 18.77 13 24 13c3.1 0 5.94 1.1 8.16 2.91l5.66-5.66C34.9 7.14 29.7 5 24 5c-7.18 0-13 5.82-13 13 0 2.08.49 4.04 1.305 5.691z"/>
      <path fill="#4CAF50" d="M24 45c5.22 0 9.86-1.72 13.52-4.66l-6.24-5.26C29.1 36.72 26.68 37.5 24 37.5c-5.29 0-9.86-3.58-11.49-8.5l-6.53 5.03C8.09 40.98 15.46 45 24 45z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.33 3.91-4.78 6.91-8.783 7.98l6.24 5.26C35.74 38.91 40 31.5 40 23c0-1.47-.15-2.9-.389-4.25z"/>
    </svg>
  );

  const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M16.365 1.43c0 1.14-.467 2.228-1.217 3.026-.78.826-2.06 1.46-3.133 1.374-.143-1.097.41-2.252 1.147-3.03.816-.85 2.22-1.463 3.203-1.37zM20.5 17.074c-.23.533-.5 1.055-.813 1.56-.43.703-.936 1.457-1.652 1.467-.69.013-.91-.424-1.697-.424-.787 0-1.03.41-1.703.438-.693.028-1.22-.76-1.65-1.463-1.13-1.83-2-5.16-.836-7.412.58-1.11 1.615-1.813 2.824-1.83.66-.013 1.28.454 1.693.454.41 0 1.17-.56 1.973-.478.337.014 1.293.136 1.904 1.043-.05.03-1.138.667-1.125 2.02.015 1.608 1.38 2.142 1.396 2.15-.014.044-.219.763-.114 1.475.108.724.49 1.312 1.176 1.6-.137.4-.277.77-.376 1.1z"/>
    </svg>
  );

  // Load Google Identity Services script once
  useEffect(() => {
    if (document.getElementById('google-ids-sdk')) return;
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.id = 'google-ids-sdk';
    document.body.appendChild(s);
  }, []);

  const handleGoogleCredential = async (credential) => {
    try {
      const res = await axios.post(`${USER_API_END_POINT}/google`, { idToken: credential }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res?.data?.success) {
        dispatch(getUser(res.data.user || null));
        toast.success(res?.data?.message || 'Signed in with Google');
        navigate('/');
      } else {
        toast.error(res?.data?.message || 'Google sign-in failed');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Google sign-in failed');
      console.error(err);
    }
  };

  const signInWithApple = () => {
    toast('Apple sign-in not configured yet', { icon: '🍎' });
  };

  const signInWithGoogle = () => {
    const returnTo = encodeURIComponent(window.location.origin + '/');
    window.location.href = `${USER_API_END_POINT}/google/start?returnTo=${returnTo}`;
  };

  // helpers for sign-in modal
  const isEmail = (val) => /.+@.+\..+/.test(String(val).toLowerCase());

  const handleNextFromId = (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      toast.error('Enter your phone, email address, or username');
      return;
    }
    if (!isEmail(identifier.trim())) {
      // backend login expects email; require email here for now
      toast.error('Please enter a valid email address to continue');
      return;
    }
    setLoginStep('password');
  };

  const handleSignIn = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, { email: identifier.trim(), password }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      dispatch(getUser(res?.data?.user || null));
      if (res?.data?.success) {
        navigate('/');
        toast.success(res?.data?.message || 'Login successful');
      }
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Login failed';
      toast.error(message);
      console.log(error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // login
      try {
        const res = await axios.post(`${USER_API_END_POINT}/login`, { email, password }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        }); 
        dispatch(getUser(res?.data?.user || null));
        if(res?.data?.success){
          navigate("/");
          toast.success(res?.data?.message || 'Login successful');
        }
      } catch (error) {
        const message = error?.response?.data?.message || error?.message || 'Login failed';
        toast.error(message);
        console.log(error);
      }
    } else {
      // signup
      try {
        const res = await axios.post(`${USER_API_END_POINT}/register`, { name, username, email, password }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        }); 
        if(res?.data?.success){
          setView('login');
          toast.success(res?.data?.message || 'Account created');
        }
      } catch (error) {
        const message = error?.response?.data?.message || error?.message || 'Signup failed';
        toast.error(message);
        console.log(error);
      }
    }
  }

  const showLanding = () => setView('landing');

  return (
  <div className='min-h-screen w-full text-white flex overflow-y-auto relative'>
      {/* solid black background */}
      <div className='absolute inset-0 -z-10 bg-black' />
      {/* Left column: twitter logo */}
      <div className='hidden md:flex flex-1 items-center justify-center p-8'>
        <img
          src="/twitter-logo.png"
          alt="Twitter logo"
          className='w-80 h-80 md:w-[520px] md:h-[520px] object-contain opacity-90 drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]'
        />
      </div>

      {/* Right column */}
      <div className='flex-1 flex items-center justify-center p-6'>
        {view === 'landing' && (
          <div className='max-w-md w-full bg-black border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_10px_60px_rgba(0,0,0,0.6)]'>
            <h1 className='text-5xl md:text-[64px] font-extrabold leading-tight'>Happening now</h1>
            <h2 className='text-3xl font-extrabold mt-2'>Join today.</h2>

            <div className='mt-6 space-y-3'>
              <button onClick={signInWithGoogle} className='w-full bg-white text-black font-semibold py-3 rounded-full hover:opacity-90 flex items-center justify-center gap-2 transition'>
                <GoogleIcon />
                <span>Sign up with Google</span>
              </button>
              <button onClick={signInWithApple} className='w-full bg-black/60 border border-white/20 text-white font-semibold py-3 rounded-full hover:bg-white/10 flex items-center justify-center gap-2 transition'>
                <AppleIcon />
                <span>Sign up with Apple</span>
              </button>
              <div className='flex items-center gap-3 text-white/60 mt-2'>
                <span className='h-px flex-1 bg-white/20'></span>
                <span>OR</span>
                <span className='h-px flex-1 bg-white/20'></span>
              </div>
              <button onClick={() => setView('signup')} className='w-full bg-white text-black font-semibold py-3 rounded-full hover:opacity-90 transition'>Create account</button>
            </div>

            <div className='mt-8'>
              <div className='text-xl font-extrabold'>Already have an account?</div>
              <div className='mt-4 space-y-3'>
                <button onClick={() => setView('login')} className='w-full border border-white/20 text-white font-semibold py-3 rounded-full hover:bg-white/10 transition'>Sign in</button>
                <button onClick={signInWithGoogle} className='w-full border border-white/20 text-white font-semibold py-3 rounded-full hover:bg-white/10 flex items-center justify-center gap-2 transition'>
                  <GoogleIcon />
                  <span>Sign in with Google</span>
                </button>
                <button onClick={signInWithApple} className='w-full border border-white/20 text-white font-semibold py-3 rounded-full hover:bg-white/10 flex items-center justify-center gap-2 transition'>
                  <AppleIcon />
                  <span>Sign in with Apple</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {isSignup && (
          <div className='max-w-md w-full bg-black border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_10px_60px_rgba(0,0,0,0.6)]'>
            <button onClick={showLanding} className='text-white/70 hover:text-white text-sm mb-4'>&larr; Back</button>
            <h1 className='text-3xl font-extrabold mb-6'>Create your account</h1>
            <form onSubmit={submitHandler} className='flex flex-col w-full'>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' className="bg-white/5 text-white placeholder:text-white/60 outline-blue-500 border border-white/15 px-4 py-3 rounded-xl my-2 focus:border-white/30" />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' className="bg-white/5 text-white placeholder:text-white/60 outline-blue-500 border border-white/15 px-4 py-3 rounded-xl my-2 focus:border-white/30" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className="bg-white/5 text-white placeholder:text-white/60 outline-blue-500 border border-white/15 px-4 py-3 rounded-xl my-2 focus:border-white/30" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className="bg-white/5 text-white placeholder:text-white/60 outline-blue-500 border border-white/15 px-4 py-3 rounded-xl my-2 focus:border-white/30" />
              <button className='bg-[#1D9BF0] border-none py-3 mt-4 rounded-full text-lg text-white font-bold hover:brightness-110 transition'>Create account</button>
              <div className='mt-3 text-sm text-white/70'>
                <>Already have an account? <span onClick={() => { setView('login'); setLoginStep('id'); }} className='font-bold text-twitter cursor-pointer'>Sign in</span></>
              </div>
            </form>
          </div>
        )}

        {isLogin && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70'>
            <div className='w-[540px] max-w-[95vw] bg-black border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_120px_rgba(0,0,0,0.8)]'>
              {/* modal header icon */}
              <div className='relative flex items-center justify-center pt-4'>
                <img src="/twitter-logo.png" alt="X" className='w-6 h-6 opacity-90' />
                <button onClick={() => { setView('landing'); setIdentifier(''); setPassword(''); setLoginStep('id'); }} className='absolute left-4 top-3 text-2xl text-white/80 hover:text-white'>×</button>
              </div>

              <div className='px-6 pb-6 pt-2'>
                {loginStep === 'id' && (
                  <>
                    <h1 className='text-[32px] font-extrabold mt-3 mb-5'>Sign in to X</h1>
                    <div className='space-y-3'>
                      <button onClick={signInWithGoogle} className='w-full bg-white text-black font-semibold py-3 rounded-full hover:opacity-90 flex items-center justify-center gap-2'>
                        <GoogleIcon />
                        <span>Sign in with Google</span>
                      </button>
                      <button onClick={signInWithApple} className='w-full bg-black border border-white/30 text-white font-semibold py-3 rounded-full hover:bg-white/10 flex items-center justify-center gap-2'>
                        <AppleIcon />
                        <span>Sign in with Apple</span>
                      </button>
                    </div>
                    <div className='flex items-center gap-3 text-white/60 my-5'>
                      <span className='h-px flex-1 bg-white/20'></span>
                      <span>or</span>
                      <span className='h-px flex-1 bg-white/20'></span>
                    </div>
                    <form onSubmit={handleNextFromId}>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder='Phone, email address, or username'
                        className="w-full bg-white/5 text-white placeholder:text-white/60 outline-blue-500 border border-white/15 px-4 py-3 rounded-xl mb-3 focus:border-white/30"
                      />
                      <button type='submit' className='w-full bg-white text-black font-semibold py-3 rounded-full hover:opacity-90 transition'>Next</button>
                    </form>
                    <button className='w-full mt-3 border border-white/20 text-white font-semibold py-3 rounded-full hover:bg-white/10 transition'>Forgot password?</button>
                    <div className='mt-6 text-sm text-white/70'>
                      Don’t have an account? <span onClick={() => { setView('signup'); }} className='font-bold text-twitter cursor-pointer'>Sign up</span>
                    </div>
                  </>
                )}

                {loginStep === 'password' && (
                  <>
                    <h1 className='text-[28px] font-extrabold mt-3 mb-4'>Enter your password</h1>
                    <div className='text-white/70 text-sm mb-2'>
                      Using email: <span className='text-white'>{identifier}</span>
                    </div>
                    <form onSubmit={handleSignIn}>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        className="w-full bg-white/5 text-white placeholder:text-white/60 outline-blue-500 border border-white/15 px-4 py-3 rounded-xl mb-3 focus:border-white/30"
                      />
                      <button type='submit' className='w-full bg-[#1D9BF0] text-white font-bold py-3 rounded-full hover:brightness-110 transition'>Sign in</button>
                    </form>
                    <button className='w-full mt-3 border border-white/20 text-white font-semibold py-3 rounded-full hover:bg-white/10 transition'>Forgot password?</button>
                    <div className='mt-6 text-sm text-white/70'>
                      Don’t have an account? <span onClick={() => { setView('signup'); setLoginStep('id'); }} className='font-bold text-twitter cursor-pointer'>Sign up</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login