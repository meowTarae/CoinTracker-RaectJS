import { BrowserRouter, Switch, Route } from "react-router-dom";
import Coin from "./routes/Coin";
import Coins from "./routes/Coins";

interface IRouterProps {
  toggleTheme: () => void;
  isDark: boolean;
}

function Router({ toggleTheme, isDark }: IRouterProps) {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path="/:coinId">
          <Coin isDark={isDark} toggleTheme={toggleTheme} />
        </Route>
        <Route path="/">
          <Coins isDark={isDark} toggleTheme={toggleTheme} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
