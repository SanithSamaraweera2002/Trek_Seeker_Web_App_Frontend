import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Layout, Typography, Row, Col, Select, Input, Button, Table } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import CurrencyCodes from 'currency-codes';
import { Footer } from '../../components/footer/Footer';
import './CurrencyConversion.scss';
import { isMobile } from 'react-device-detect';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const columns = [
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
  },
  {
    title: 'Exchange Rate',
    dataIndex: 'rate',
    key: 'rate',
  },
];

export const CurrencyConversion = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [popularRates, setPopularRates] = useState<any[]>([]);
  const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL = process.env.REACT_APP_CURRENCY_API;

  // Function to fetch conversion rate
  const fetchConversionRate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}${fromCurrency}`);
      const rate = response.data.rates[toCurrency];
      setConvertedAmount(amount * rate);
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch popular exchange rates
  const fetchPopularRates = async () => {
    try {
      const response = await axios.get(`${API_URL}USD`);
      const popularCurrencies = ['EUR', 'LKR', 'GBP', 'JPY', 'AUD'];
      const rates = popularCurrencies.map((currency) => ({
        currency: `USD to ${currency}`,
        rate: response.data.rates[currency].toFixed(2),
      }));
      setPopularRates(rates);
    } catch (error) {
      console.error('Error fetching popular rates:', error);
    }
  };

  // Function to fetch currency options and names
  const fetchCurrencyOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}USD`);
      const currencies = response.data.rates;

      const options = Object.keys(currencies).map((currencyCode) => ({
        currency: currencyCode,
        name: CurrencyCodes.code(currencyCode)?.currency || currencyCode,
        displayText: `${CurrencyCodes.code(currencyCode)?.currency || currencyCode} (${currencyCode})`,
      }));

      setCurrencyOptions(options);
    } catch (error) {
      console.error('Error fetching currency options:', error);
    }
  };

  useEffect(() => {
    fetchConversionRate();
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    fetchPopularRates();
    fetchCurrencyOptions();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(value > 0 ? value : 1);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Custom filter function for Select search
  const filterOption = (input: string, option: any) => {
    const displayText = option.props.children.toLowerCase();
    return displayText.includes(input.toLowerCase());
  };

  return (
    <Content className="currency-page-content">
      <Title level={2} className="currency-page-header">
        Currency Conversion
      </Title>
      {!isMobile ? (
        <Card className="currency-form">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter Amount"
                className="currency-input"
                min={1}
              />
            </Col>
            <Col span={16}>
              <div className="currency-selection">
                <Select
                  className="currency-select"
                  value={fromCurrency}
                  onChange={(value) => setFromCurrency(value)}
                  showSearch
                  filterOption={filterOption}
                >
                  {currencyOptions.map((option) => (
                    <Option key={option.currency} value={option.currency}>
                      {option.displayText}
                    </Option>
                  ))}
                </Select>
                <Button type="default" icon={<SwapOutlined />} className="swap-button" onClick={swapCurrencies} />
                <Select
                  className="currency-select"
                  value={toCurrency}
                  onChange={(value) => setToCurrency(value)}
                  showSearch
                  filterOption={filterOption}
                >
                  {currencyOptions.map((option) => (
                    <Option key={option.currency} value={option.currency}>
                      {option.displayText}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
          <Row className="exchange-rate-display">
            <Col span={24}>
              <Title level={4}>
                {amount} {fromCurrency} ={' '}
                {loading ? 'Loading...' : convertedAmount ? convertedAmount.toFixed(2) : '...'} {toCurrency}
              </Title>
              <p>
                1 {fromCurrency} ={' '}
                {loading ? 'Loading...' : convertedAmount ? (convertedAmount / amount).toFixed(4) : '...'} {toCurrency}
              </p>
            </Col>
          </Row>
        </Card>
      ) : (
        <Card className="currency-form">
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter Amount"
                className="currency-input"
                min={1}
              />
            </Col>
            <Col xs={24}>
              <Select
                className="currency-select"
                value={fromCurrency}
                onChange={(value) => setFromCurrency(value)}
                showSearch
                filterOption={filterOption}
              >
                {currencyOptions.map((option) => (
                  <Option key={option.currency} value={option.currency}>
                    {option.displayText}
                  </Option>
                ))}
              </Select>{' '}
            </Col>
            <Col xs={24} style={{ textAlign: 'center' }}>
              <Button type="default" icon={<SwapOutlined />} className="swap-button" onClick={swapCurrencies} />
            </Col>

            <Col xs={24}>
              <Select
                className="currency-select"
                value={toCurrency}
                onChange={(value) => setToCurrency(value)}
                showSearch
                filterOption={filterOption}
              >
                {currencyOptions.map((option) => (
                  <Option key={option.currency} value={option.currency}>
                    {option.displayText}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row className="exchange-rate-display">
            <Col span={24}>
              <Title level={4}>
                {amount} {fromCurrency} ={' '}
                {loading ? 'Loading...' : convertedAmount ? convertedAmount.toFixed(2) : '...'} {toCurrency}
              </Title>
              <p>
                1 {fromCurrency} ={' '}
                {loading ? 'Loading...' : convertedAmount ? (convertedAmount / amount).toFixed(4) : '...'} {toCurrency}
              </p>
            </Col>
          </Row>
        </Card>
      )}

      <Card className="currency-rates">
        <Title level={3}>Popular Currency Exchange Rates</Title>
        <Table dataSource={popularRates} pagination={false} columns={columns} rowKey="currency" />
      </Card>
      <Footer />
    </Content>
  );
};
