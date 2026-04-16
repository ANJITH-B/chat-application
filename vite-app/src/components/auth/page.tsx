import React, { useMemo, useState } from 'react'
import { Popup } from './layout'
import Button from '../ui/button'
import Label from '../ui/label'
import { Input } from '../ui/Input'
import { useAuthStore } from '../../store/useAuthStore'
import { initialFormData, type FormDataType, type InfoType, type TabType } from './types'
import { validateForm } from './helper/validation'

const Auth = () => {
    const { signIn, signUp, googleAuth, githubAuth } = useAuthStore();

    const [tab, setTab] = useState<TabType>("LogIn");
    const [info, setInfo] = useState<InfoType[] | null>(null);
    const [formData, setFormData] = useState<FormDataType>(initialFormData);

    const isSignUp = useMemo(() => tab === "SignUp", [tab]);
    const isLogin = useMemo(() => tab === "LogIn", [tab]);
    const showConfirmPassword = useMemo(
        () => tab === "SignUp" || tab === "ResetPassword",
        [tab]
    );

    const handleChange = (field: keyof FormDataType, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validateForm(tab, formData);
        if (errors.length > 0) {
            setInfo(errors);
            return;
        }
        setInfo(null);
        if (tab === "LogIn") signIn(formData);
        if (tab === "SignUp") signUp(formData);
    };


    return (<>
        <Popup tab={tab}>
            <Popup.Section>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {isSignUp &&
                        <Input placeholder='Johon Doe' type='text' value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
                    }
                    <Input placeholder='name@example.com' type='email' value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />

                    <Input placeholder='password' type='password' value={formData.password} onChange={(e) => handleChange("password", e.target.value)} />

                    {showConfirmPassword && <Input placeholder='Confirm password' type='password' value={formData.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} />}

                    {isLogin && <Button className='w-full' variant='link' onClick={() => setTab("ResetPassword")}> forgot Password</Button>}


                    {info && (
                        <Label type={info[0].type} message={info.length === 1 ? info[0].msg : undefined}>
                            {info.length > 1 && info.map((item, index) => (
                                <Label.Items key={index} message={item.msg} type={item.type} />
                            ))}
                        </Label>
                    )}


                    <Button icon={tab === 'LogIn' ? 'LogIn' : 'SignUp'}>{tab === 'LogIn' ? 'Sign In' : 'Create Account'}</Button>
                </form>
            </Popup.Section>

            <Popup.Section className='flex mx-auto gap-4 justify-center'>
                <Button icon='Google' variant='social' onClick={googleAuth}> Google </Button>
                <Button icon='Github' variant='social' onClick={githubAuth}> Github </Button>
            </Popup.Section>

            {isSignUp && (
                <Popup.Section >
                    <Label message='Guest mode allows you to explore the application without creating an account. Some features may be restricted.' type='info'>
                        <Button icon='Guest'>Continue as Guest</Button>
                    </Label>
                </Popup.Section>
            )}

            <Popup.Section className='py-5'>
                <p className="text-slate-500 text-sm flex gap-2 items-center">
                    {tab === 'LogIn' ? "Don't have an account?" : "Already have an account?"}
                    <Button onClick={() => setTab(tab === 'LogIn' ? 'SignUp' : 'LogIn')} variant='link'>{tab === 'LogIn' ? 'Sign Up' : 'Log In'}</Button>
                </p>
            </Popup.Section>
        </Popup>
    </>
    )
}

export default Auth