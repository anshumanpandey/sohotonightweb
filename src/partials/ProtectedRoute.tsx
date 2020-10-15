
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ component: Component, ...rest }: any) {
    return (
        <Route {...rest} render={
          props => {
            if (localStorage.getItem("jwtToken")) {
              return <Component {...rest} {...props} />
            } else {
              return <Redirect to={
                {
                  pathname: '/login',
                  state: {
                    from: props.location
                  }
                }
              } />
            }
          }
        } />
      )
}
export default ProtectedRoute;

    