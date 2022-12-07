import React, { createContext, useState } from "react";

const UserContext = createContext();
const UserProvider = ({ children }) => {

    const [isTourist, setisTourist] = useState(false);
    return (
        <UserContext.Provider value={{ isTourist, setisTourist }}>
            {children}
        </UserContext.Provider>
    );
};

const withUser = (Child) => (props) =>
(
    <UserContext.Consumer>
        {(context) => <Child {...props} {...context} />}
        {/* Another option is:  {context => <Child {...props} context={context}/>}*/}
    </UserContext.Consumer>
);

export { UserContext, UserProvider, withUser };
