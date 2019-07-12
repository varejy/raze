import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldRadioImageButtons from '../Form/fields/FormFieldRadioImageButtons/FormFieldRadioImageButtons';
import FormFieldRadioButtons from '../Form/fields/FormFieldRadioButtons/FormFieldRadioButtons';

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
                component: FormFieldRadioImageButtons,
                name: 'deliveryType',
                title: 'Выберите тип доставки: ',
                options: [
                    'src/apps/client/ui/components/Order/icons/nova_Poshta.png',
                    'src/apps/client/ui/components/Order/icons/ukrposhta.png'
                ],
                validators: [
                    { name: 'required' }
                ]
            },
            {
                component: FormFieldRadioButtons,
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
                theme: 'typeOrder',
                name: 'submit',
                title: 'отправить заказ'
            }
        ]
    };
}
