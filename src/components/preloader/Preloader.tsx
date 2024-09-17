import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Lottie from 'lottie-react';
import preloaderAnimation from '../../assets/animations/preloaderAnimation.json';

export const Preloader: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div className="preloader">
      <Lottie animationData={preloaderAnimation} loop autoPlay className="preloader-animation" />
      <p className="preloader-text">
        Crafting your perfect itinerary...
        <br />
        Sit tight, adventure awaits!
      </p>
    </div>
  );
};
