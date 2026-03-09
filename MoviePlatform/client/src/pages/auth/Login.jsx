import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router';
import { apiService } from '../../services/api.service';

// Internal Components
import AuthForm from './AuthForm';
import AttributionFooter from '../../components/ui/AttributionFooter';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isBanned, setIsBanned] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setIsBanned(false);

        try {
            const data = isLogin
                ? await apiService.login({ email: formData.email, password: formData.password })
                : await apiService.register(formData);

            dispatch(setCredentials({ user: data, token: data.token }));
            navigate('/');
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message || 'Something went wrong';
            if (status === 403) {
                setIsBanned(true);
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <AuthForm
                isLogin={isLogin}
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                isBanned={isBanned}
            />

            <div className="w-full max-w-md">
                <p className="mt-6 text-center text-textSub">
                    {isLogin ? "New to MovieApp? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-white hover:underline transition ml-1"
                    >
                        {isLogin ? 'Sign up now' : 'Sign In'}
                    </button>
                </p>
                <AttributionFooter type="auth" />
            </div>
        </div>
    );
};

export default Login;
