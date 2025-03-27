import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { games, gameSettings } from "../constants/gameData";
import { getTokenOrRefresh } from "../token_util";
import useMicrophone from "../hooks/useMicrophone";

const MainMenu = () => {
  const navigate = useNavigate();
  const { micStatus, requestMicrophoneAccess } = useMicrophone(); // Use the hook to get microphone status and request access
  const [voiceServiceStatus,setVoiceServiceStatus] = useState(false);

  useEffect(() => {
    // Prefetch token silently when main menu loads
    const prefetchToken = async () => {
      try {
        const { authToken }= await getTokenOrRefresh();
        if (authToken) {
          setVoiceServiceStatus(true);
        } else {
          setVoiceServiceStatus(false);
        }
      } catch (error) {
        console.error("Background token prefetch failed:", error);
        setVoiceServiceStatus(false);
      }
    };
    
    prefetchToken();
  }, []);

  const handleGameSelection = (gameId) => {
    if (gameSettings[gameId]?.length > 0) {
      navigate(`/settings/${gameId}`);
    } else {
      navigate(`/game/${gameId}`);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center px-3">

      {/* Main game selection content */}
      <div className="flex w-[850px] flex-col items-center gap-8 rounded-lg bg-white px-10 py-14 shadow-xl max-md:px-6 max-md:py-10 relative">
      
      {/* Status buttons container - moves above title on mobile */}
      <div className="absolute right-4 top-4 flex flex-col gap-2 max-md:static max-md:flex-row max-md:justify-center max-md:w-full max-md:mb-2 max-md:-order-1">
      
      {/* Microphone status button */}
      <button 
            onClick={requestMicrophoneAccess}
            className={`flex p-2 rounded-full items-center ${
              micStatus.available === false 
                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                : micStatus.permission 
                  ? 'text-green-500 bg-green-50 hover:bg-green-100' 
                  : 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
            } max-md:text-sm max-md:px-3 max-md:py-1`}
            title={
              micStatus.available === false 
                ? "No microphone detected" 
                : micStatus.permission 
                  ? "Microphone access granted" 
                  : "Microphone access needed"
            }
          >
            {micStatus.available === false ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 max-md:h-4 max-md:w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="max-md:hidden">No Microphone</span>
              </>
            ) : micStatus.permission ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 max-md:h-4 max-md:w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="max-md:hidden">Microphone Ready</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 max-md:h-4 max-md:w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                <span className="max-md:hidden">Microphone Permissions!</span>
              </>
            )}
          </button>

      {/* Voice service status button */}
      <button 
        
        className={`flex p-2 rounded-full items-center ${
          voiceServiceStatus ? 'text-blue-500 bg-blue-50 hover:bg-blue-100' 
          : 'text-red-500 bg-red-50 hover:bg-red-100'
        } max-md:text-sm max-md:px-3 max-md:py-1`}
        title={voiceServiceStatus ? "Voice service connected" : "Voice service not connected"}
      >
        {voiceServiceStatus ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 max-md:h-4 max-md:w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="max-md:hidden">Voice Service Ready</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 max-md:h-4 max-md:w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            <span className="max-md:hidden">Voice Offline</span>
          </>
        )}
      </button>
    </div>

        
        <h1 className="text-3xl font-bold text-gray-800 max-md:mt-2">Choose a Game</h1>
        <div className="grid w-full grid-cols-2 gap-6 max-md:grid-cols-1">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameSelection(game.id)}
              className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-6 shadow-md transition hover:bg-gray-200 hover:shadow-lg cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-700">{game.name}</h2>
              <p className="text-sm text-gray-600 whitespace-pre-line text-center">{game.description}</p>
              {game.requiresMicrophone && /*!micPermission && */ (
                <span className="mt-2 text-xs text-yellow-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Requires microphone
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div> 
  );
};

export default MainMenu;