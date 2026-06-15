import DynamicPolicy from '../components/common/DynamicPolicy';

export default function ShippingPolicy() {
  return <DynamicPolicy settingKey="shipping" defaultTitle="Shipping Policy" />;
}
