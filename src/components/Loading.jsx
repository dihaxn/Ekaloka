import React from 'react';

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <style jsx>{`
                @keyframes circleDai {
                    0% {
                        top: 60px;
                        height: 8px;
                        border-radius: 50px 50px 25px 25px;
                        transform: scaleX(1.7);
                    }
                    40% {
                        height: 20px;
                        border-radius: 50%;
                        transform: scaleX(1);
                    }
                    100% {
                        top: 0%;
                    }
                }
                
                @keyframes shadowDai {
                    0% {
                        transform: scaleX(1.5);
                    }
                    40% {
                        transform: scaleX(1);
                        opacity: 0.7;
                    }
                    100% {
                        transform: scaleX(0.2);
                        opacity: 0.4;
                    }
                }
                
                .dai-circle {
                    animation: circleDai 0.5s alternate infinite ease;
                }
                
                .dai-shadow {
                    animation: shadowDai 0.5s alternate infinite ease;
                }
                
                .delay-1 { animation-delay: 0s; }
                .delay-2 { animation-delay: 0.2s; }
                .delay-3 { animation-delay: 0.3s; }
            `}</style>
            
            <div className="flex flex-col items-center">
                <div className="relative w-48 h-16 mb-8">
                    {/* Circles */}
                            <div className="dai-circle delay-1 absolute w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 left-1/4 transform -translate-x-1/2"></div>
        <div className="dai-circle delay-2 absolute w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 left-1/2 transform -translate-x-1/2"></div>
        <div className="dai-circle delay-3 absolute w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 left-3/4 transform -translate-x-1/2"></div>
                    
                    {/* Shadows */}
                            <div className="dai-shadow delay-1 absolute w-5 h-2 rounded-full bg-gradient-to-r from-amber-900/70 to-amber-700/70 top-[62px] left-1/4 transform -translate-x-1/2 filter blur-[1px]"></div>
        <div className="dai-shadow delay-2 absolute w-5 h-2 rounded-full bg-gradient-to-r from-amber-900/70 to-amber-700/70 top-[62px] left-1/2 transform -translate-x-1/2 filter blur-[1px]"></div>
        <div className="dai-shadow delay-3 absolute w-5 h-2 rounded-full bg-gradient-to-r from-amber-900/70 to-amber-700/70 top-[62px] left-3/4 transform -translate-x-1/2 filter blur-[1px]"></div>
                </div>
                
                <div className="flex items-center space-x-3 mt-6 animate-pulse">
                                <div className="bg-gradient-to-r from-amber-500 to-amber-300 p-2 rounded-lg">
                <div className="bg-black p-1 rounded-md">
                    <span className="text-amber-400 font-bold text-xl">DF</span>
                </div>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">
                Dai Fashion
            </h1>
                </div>
                
                <p className="mt-4 text-gray-400 max-w-md text-center px-4">
                    Crafting elegance in every moment
                </p>
            </div>
        </div>
    );
};

export default Loading;