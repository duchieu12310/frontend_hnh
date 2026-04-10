import { EntityPropertySchema, EntityPropertyType, SelectOption } from "types";
import { ListResponse } from "utils/FetchUtils";
import {
	Book,
	Notebook,
	School,
	Box,
	BrandPaypal,
	Cash,
	Icon,
} from "tabler-icons-react";
import { PaymentMethodType } from "models/PaymentMethod";
import VnpayIcon from "components/VnpayIcon";
import CashIcon from "components/CashIcon";
import PaypalIcon from "components/PaypalIcon";

class PageConfigs {
	static properties = {
		id: {
			label: "ID",
			type: EntityPropertyType.NUMBER,
		},
		createdAt: {
			label: "Ngày tạo",
			type: EntityPropertyType.DATE,
		},
		updatedAt: {
			label: "Ngày cập nhật",
			type: EntityPropertyType.DATE,
		},
		createdBy: {
			label: "Người tạo",
			type: EntityPropertyType.NUMBER,
		},
		updatedBy: {
			label: "Người cập nhật",
			type: EntityPropertyType.NUMBER,
		},
	};

	static getProperties = (
		...isShowInTable: boolean[]
	): EntityPropertySchema => {
		const properties = JSON.parse(
			JSON.stringify(PageConfigs.properties)
		) as EntityPropertySchema;
		Object.values(properties).forEach(
			(value, index) =>
				isShowInTable[index] &&
				(value.isShowInTable = isShowInTable[index])
		);
		return properties;
	};

	static initialListResponse: ListResponse = {
		content: [],
		page: 1,
		size: 5,
		totalElements: 0,
		totalPages: 0,
		last: false,
	};

	static initialPageSizeSelectList: SelectOption[] = [
		{
			value: "5",
			label: "5",
		},
		{
			value: "10",
			label: "10",
		},
		{
			value: "25",
			label: "25",
		},
		{
			value: "50",
			label: "50",
		},
	];

	static categorySlugIconMap: Record<string, Icon> = new Proxy(
		{
			"van-hoc-trong-nuoc": Book,
			"van-hoc-nuoc-ngoai": School,
			"kinh-te": Notebook,
			"ky-nang-song": Book,
			"thieu-nhi": School,
			"ngoai-ngu": Notebook,
		},
		{
			get: function (target: Record<string, Icon>, name: string) {
				return Object.prototype.hasOwnProperty.call(target, name)
					? target[name]
					: Box;
			},
		}
	);

	static paymentMethodIconMap: Record<PaymentMethodType, Icon> = {
		[PaymentMethodType.CASH]: CashIcon as unknown as Icon,
		[PaymentMethodType.PAYPAL]: PaypalIcon as unknown as Icon,
		[PaymentMethodType.VNPAY]: VnpayIcon as Icon,
	};

	static paymentMethodNameMap: Record<PaymentMethodType, string> = {
		[PaymentMethodType.CASH]: "Thanh toán khi nhận hàng (COD)",
		[PaymentMethodType.PAYPAL]: "Thanh toán qua PayPal",
		[PaymentMethodType.VNPAY]: "Thanh toán qua VNPAY",
	};
}

export default PageConfigs;
