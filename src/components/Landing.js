import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Landing = () => {
    const heroTextRef = useRef(null);
    const heroSubRef = useRef(null);
    const buttonRef = useRef(null);
    const featureCardsRef = useRef([]);

    useEffect(() => {
        const tl = gsap.timeline();

        // Hero Section Animations
        tl.fromTo(heroTextRef.current, 
            { opacity: 0, y: 50 }, 
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
        .fromTo(heroSubRef.current, 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 
            '-=0.5'
        )
        .fromTo(buttonRef.current, 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, 
            '-=0.3'
        );

        // Feature cards staggering animation
        gsap.fromTo(featureCardsRef.current, 
            { opacity: 0, y: 50 }, 
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                stagger: 0.2, 
                ease: 'power3.out',
                scrollTrigger: featureCardsRef.current // Simple trigger if scroll plugin added, but keeping it immediately visible here for simplicity or relying on delayed stagger
            }
        ).delay(1.5);

    }, []);

    const addToRefs = (el) => {
        if (el && !featureCardsRef.current.includes(el)) {
            featureCardsRef.current.push(el);
        }
    };

    return (
        <div className='container text-center' style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '50px' }}>
            
            {/* Hero Section */}
            <div style={{ marginBottom: '100px' }}>
                <h1 ref={heroTextRef} style={{ fontSize: '4rem', fontWeight: '800', background: '-webkit-linear-gradient(45deg, #00f2fe, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Digitize Your Mind.
                </h1>
                <p ref={heroSubRef} className='mt-3 text-muted' style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    The most secure, lightning-fast, and futuristic way to store your thoughts on the cloud. Powered by enterprise-grade infrastructure.
                </p>
                <div ref={buttonRef} className='mt-5'>
                    <Link to={localStorage.getItem('token') ? "/dashboard" : "/signup"} className='btn btn-primary btn-lg' style={{ padding: '15px 40px', fontSize: '1.2rem', borderRadius: '50px' }}>
                        {localStorage.getItem('token') ? "Go to Dashboard" : "Get Started Now"}
                    </Link>
                </div>
            </div>

            {/* Features Grid */}
            <div className='row my-5'>
                <div className='col-md-4 mb-4' ref={addToRefs}>
                    <div className='card h-100' style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                        <div className='card-body py-5'>
                            <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>???</h2>
                            <h4 className='card-title' style={{ color: '#00f2fe' }}>Military-Grade Security</h4>
                            <p className='card-text text-muted'>Your notes are encrypted and accessible only by you with secure JWT tokens. Always private.</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 mb-4' ref={addToRefs}>
                    <div className='card h-100' style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                        <div className='card-body py-5'>
                            <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>?</h2>
                            <h4 className='card-title' style={{ color: '#00f2fe' }}>Instant Sync</h4>
                            <p className='card-text text-muted'>Read and write from anywhere, instantly updated via our robust Node.js and MongoDB backend.</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 mb-4' ref={addToRefs}>
                    <div className='card h-100' style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                        <div className='card-body py-5'>
                            <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>??</h2>
                            <h4 className='card-title' style={{ color: '#00f2fe' }}>Futuristic Design</h4>
                            <p className='card-text text-muted'>A beautiful dark-neon glassmorphism UI that does not blind you at 2 AM.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* DevOps Flex Section */}
            <div className='mt-5 mb-5 p-5' style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '20px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                <h3 className='mb-4' style={{ color: '#b0c4de' }}>Powered by Automated CI/CD Infrastructure</h3>
                <div className='d-flex justify-content-center align-items-center flex-wrap gap-4'>
                    <span className='badge bg-dark p-3 fs-5' style={{ border: '1px solid #4facfe' }}>?? Docker</span>
                    <span className='badge bg-dark p-3 fs-5' style={{ border: '1px solid #4facfe' }}>??? Jenkins</span>
                    <span className='badge bg-dark p-3 fs-5' style={{ border: '1px solid #4facfe' }}>?? Ansible</span>
                    <span className='badge bg-dark p-3 fs-5' style={{ border: '1px solid #4facfe' }}>?? React</span>
                    <span className='badge bg-dark p-3 fs-5' style={{ border: '1px solid #4facfe' }}>?? MongoDB</span>
                </div>
                <p className='mt-4 text-muted'>Built for scale. Deployed automatically on every push.</p>
            </div>
        </div>
    );
};

export default Landing;
