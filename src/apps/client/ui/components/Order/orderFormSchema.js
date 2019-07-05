import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldDeliveryType from '../Form/fields/FormFieldDeliveryType/FormFieldDeliveryType';
import FormFieldPaymentType from '../Form/fields/FormFieldPaymentType/FormFieldPaymentType';

export default function () {
    return {
        fields: [
            {
                component: FormFieldInput,
                name: 'fio',
                placeholder: 'Имя Фамилия',
                validators: [
                    { name: 'required' }
                ]
            },
            {
                component: FormFieldInput,
                name: 'phone',
                placeholder: 'Номер Телефона',
                validators: [
                    { name: 'required' },
                    { name: 'phone' }
                ]
            },
            {
                component: FormFieldDeliveryType,
                name: 'deliveryType',
                title: 'Выберите тип доставки: ',
                options: [
                    'src/apps/client/ui/components/Order/icons/Nova_Poshta.png',
                    'src/apps/client/ui/components/Order/icons/Ukrposhta.png'
                ],
                validators: [
                    { name: 'required' }
                ]
            },
            {
                component: FormFieldPaymentType,
                name: 'paymentType',
                title: 'Выберите тип оплаты: ',
                options: [
                    {
                        value: 'Карточкой на сайте',
                        id: 0
                    },
                    {
                        value: 'Наложенный платеж',
                        id: 1
                    },
                    {
                        value: 'Перевод на карту',
                        id: 2
                    }
                ],
                validators: [
                    { name: 'required' }
                ]
            },
            {
                component: FormFieldButton,
                position: 'center',
                backgroundColor: 'green',
                name: 'submit',
                title: 'отправить заказ'
            }
        ]
    };
}
