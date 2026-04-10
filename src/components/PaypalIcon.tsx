export default function PaypalIcon({ size = 24 }: { size?: number }) {
	return (
		<img
			src="https://cdn.brandfetch.io/id67fXUv9w/theme/dark/symbol.svg"
			alt="PayPal Logo"
			style={{ width: size, height: size, objectFit: 'contain' }}
		/>
	);
}
