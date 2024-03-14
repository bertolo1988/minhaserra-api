import { CreateAddressDto, CreateAddressModel } from './addresses.types';

export class AddressesMapper {
  static mapCreateAddressDtoToAddressModel(
    userId: string,
    dto: CreateAddressDto,
  ): CreateAddressModel {
    return {
      userId,
      label: dto.label,
      countryCode: dto.countryCode,
      name: dto.name,
      lineOne: dto.lineOne,
      lineTwo: dto.lineTwo,
      city: dto.city,
      region: dto.region,
      postalCode: dto.postalCode,
      phoneNumber: dto.phoneNumber,
    };
  }
}
