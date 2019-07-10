import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldRadioImageButtons from '../Form/fields/FormFieldRadioImageButtons/FormFieldRadioImageButtons';
import FormFieldRadioButtons from '../Form/fields/FormFieldRadioButtons/FormFieldRadioButtons';

export default function () {
    return {
        fields: [
            {
                component: FormFieldInput,
                name: 'name',
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
                name: 'orderType',
                title: 'Выберите тип доставки: ',
                options: [
                    {
                        img: 'src/apps/client/ui/components/Order/icons/nova_Poshta.png',
                        id: 'nova'
                    },
                    {
                        img: 'src/apps/client/ui/components/Order/icons/ukrposhta.png',
                        id: 'ukr'
                    }
                ],
                validators: [
                    { name: 'required' }
                ]
            },
            {
                component: FormFieldInput,
                name: 'city',
                placeholder: 'Город',
                validators: [
                    { name: 'required' }
                ]
            },
            {
                component: FormFieldInput,
                name: 'department',
                placeholder: 'Отделение',
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
                        value: 'Наложенный платеж',
                        id: 'cod'
                    },
                    {
                        value: 'Перевод на карту Приват банка',
                        id: 'card'
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
