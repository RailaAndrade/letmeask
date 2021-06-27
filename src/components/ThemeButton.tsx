
import '../styles/themebutton.scss'


type ThemeButtonProps ={
    toggleTheme? :()=>void;
};


export function ThemeButton ({toggleTheme}:ThemeButtonProps){
    return (
        <label className="switch">
            <input type="checkbox" ></input>
            <span className="slider round" onClick={toggleTheme}></span>
            
        </label>
    )
}

