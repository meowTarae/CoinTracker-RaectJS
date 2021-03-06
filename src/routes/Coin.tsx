import {
  Switch,
  Route,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";
import {
  faHome,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// <Styled>
const Container = styled.div`
  padding: 0 20px;
  margin: 0 auto;
  max-width: 400px;
`;

const Header = styled.div`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0 40px 0;
  font-weight: 900;

  position: relative; // 아이콘 위치 잡아주는 용도
`;

const Title = styled.h1`
  font-size: 48px;
  padding-top: 10px;
  color: ${(p) => p.theme.accentColor};
`;

const Loading = styled.span`
  text-align: center;
  display: block;
  margin-top: 10vh;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  /* background-color: ${(p) => p.theme.bgColor};
  box-shadow: 0px 10px 20px -15px; */
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 26px 0 26px 8px;
  text-overflow: ellipsis;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 20px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  /* text-transform: uppercase; */
  font-size: 15px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(p) => (p.isActive ? p.theme.accentColor : p.theme.textColor)};
  a {
    display: block;
  }
`;

const Icon = styled.div`
  position: absolute;
  width: 25px;
  height: 25px;
  font-size: 15px;
  top: -20%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: color 0.1s linear;
  padding: 6%;
  &:hover {
    color: ${(p) => p.theme.accentColor};
  }

  color: ${(p) => p.theme.textColor};
`;

const IconToggle = styled(Icon)`
  left: -3%;
`;

const IconHome = styled(Icon)`
  right: -3%;
`;

const IconToggleOn = styled.div`
  color: ${(p) => p.theme.accentColor};
`;
// </Styled>

// <Props>
interface RouteParams {
  coinId: string;
}
interface RouteState {
  name: string;
}
interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}
interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}
interface ICoinProps {
  toggleTheme: () => void;
  isDark: boolean;
}
// </Props>

function Coin({ toggleTheme, isDark }: ICoinProps) {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");

  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId),
    {
      refetchInterval: 5000,
    }
  );

  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Load..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
          <IconToggle onClick={toggleTheme}>
            {isDark ? (
              <FontAwesomeIcon icon={faToggleOff} />
            ) : (
              <IconToggleOn>
                <FontAwesomeIcon icon={faToggleOn} />
              </IconToggleOn>
            )}
          </IconToggle>
          <Link to={`/`}>
            <IconHome>
              <FontAwesomeIcon icon={faHome} />
            </IconHome>
          </Link>
        </Title>
      </Header>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>now Price:</span>
              <span>$ {tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description.slice(0, 318)}...</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>{infoData?.name}'s chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>{infoData?.name}'s price</Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path={`/${coinId}/price`}>
              <Price isDark={isDark} coinId={coinId} />
            </Route>
            <Route path={`/${coinId}/chart`}>
              <Chart isDark={isDark} coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Coin;
