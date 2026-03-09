import React from 'react';

const AuthForm = ({ isLogin, formData, onChange, onSubmit, loading, error, isBanned }) => (
    <div className="glass-panel p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-glassBorder animate-fade-in text-textMain">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-400 drop-shadow-md pb-4">
            {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
            <div className={`flex items-start gap-3 p-4 rounded-xl mb-4 text-sm font-semibold border ${isBanned
                ? 'bg-red-500/10 border-red-500/40 text-red-300'
                : 'bg-primary/20 border-primary/40 text-red-200'
                }`}>
                <i className={`text-xl flex-shrink-0 ${isBanned ? 'ri-forbid-2-fill text-red-400' : 'ri-alert-fill text-orange-400'}`} />
                <span>{error}</span>
            </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
            {!isLogin && (
                <div className="relative group">
                    <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-textSub group-focus-within:text-primary transition"></i>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={onChange}
                        className="w-full neumorph-inset bg-transparent text-textMain rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition font-medium"
                        required={!isLogin}
                    />
                </div>
            )}

            <div className="relative group">
                <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-textSub group-focus-within:text-primary transition"></i>
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={onChange}
                    className="w-full neumorph-inset bg-transparent text-textMain rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition font-medium"
                    required
                />
            </div>

            <div className="relative group">
                <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-textSub group-focus-within:text-primary transition"></i>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={onChange}
                    className="w-full neumorph-inset bg-transparent text-textMain rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition font-medium"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full premium-btn text-white font-bold py-3 mt-4 flex justify-center items-center shadow-xl"
            >
                {loading ? <i className="ri-loader-4-line text-xl animate-spin"></i> : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
        </form>
    </div>
);

export default AuthForm;
