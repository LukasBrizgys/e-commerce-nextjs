import NavigationBar from "./NavigationBar";
import UserMenuBar from "./UserMenuBar";

const Layout = ({ categories, children } : any) => {
    return (
        <>
            <header className="flex flex-col">
                <UserMenuBar/>
                <span style={{'padding':'0.5px'}} className={"bg-gray-200 mt-2"}></span>
                <NavigationBar categories={categories}/>
            </header>
            { children }

        </>

    )
}
export default Layout;