import './LoadingScreen.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import "primereact/resources/primereact.min.css";
import "./LoadingScreen.css"


export const LoadingScreen = () => {
    return (
        <main>
            <div className="flex h-screen justify-center items-center">
                <ProgressSpinner aria-label="Loading" strokeWidth='4' style={{width: '64px', height: '64px'}} />
            </div>
        </main>
    );
};