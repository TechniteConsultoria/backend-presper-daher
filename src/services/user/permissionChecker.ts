import assert from 'assert';
import Error403 from '../../errors/Error403';
import Plans from '../../security/plans';
import Permissions from '../../security/permissions';
import EmailSender from '../emailSender';

const plans = Plans.values;

/**
 * Checks the Permission of the User on a Tenant.
 * Hey
 */
export default class PermissionChecker {
  ImagemCreate(produtoEdit: {
    id: string; allowedRoles: string[]; allowedPlans: string[]; allowedStorage: {
      id: string; folder: string; maxSizeInBytes: number; /**
 * Checks if the current user roles allows the permission.
 */ }[];
  }) {
    throw new Error('Method not implemented.');
  }
  currentTenant;
  language;
  currentUser;

  constructor({ currentTenant, language, currentUser }) {
    this.currentTenant = currentUser.tenants[0].dataValues;
    this.language = language;
    this.currentUser = currentUser;
  }

  /**
   * Validates if the user has a specific permission
   * and throws a Error403 if it doesn't.
   */
  validateHas(permission) {
    if (!this.has(permission)) {
      throw new Error403(this.language);
    }
  }

  /**
   * Checks if the user has a specific permission.
   */
  has(permission) {
    assert(permission, 'permission is required');

    if (!this.isEmailVerified) {

      return false;
    }

    if (!this.hasPlanPermission(permission)) {

      return false;
    }
    return this.hasRolePermission(permission);
    // return true
  }

  /**
   * Validates if the user has access to a storage
   * and throws a Error403 if it doesn't.
   */
  validateHasStorage(storageId) {
    if (!this.hasStorage(storageId)) {
      throw new Error403(this.language);
    }
  }

  /**
   * Validates if the user has access to a storage.
   */
  hasStorage(storageId: string) {
    assert(storageId, 'storageId is required');
    return this.allowedStorageIds().includes(storageId);
  }

  /**
   * Checks if the current user roles allows the permission.
   */
  hasRolePermission(permission) {

	
    return this.currentUserRolesIds.some((role) =>{
      return permission.allowedRoles.some(
        (allowedRole) => {	     
	      return allowedRole == role
       }
      )
     }
    );
  }

  /**
   * Checks if the current company plan allows the permission.
   */
  hasPlanPermission(permission) {
    assert(permission, 'permission is required');

    return permission.allowedPlans.includes(
      this.currentTenantPlan,
    );
  }

  get isEmailVerified() {
    // Only checks if the email is verified
    // if the email system is on
    if (!EmailSender.isConfigured) {
      return true;
    }

    return this.currentUser.emailVerified;
  }

  /**
   * Returns the Current User Roles.
   */
  get currentUserRolesIds() {
    if (!this.currentUser || !this.currentUser.tenants) {
      return [];
    }

    const tenant = this.currentUser.tenants
      /*.filter(
        (tenantUser) => tenantUser.status === 'active',
      )*/
      .find((tenantUser) => {
        return(
          tenantUser.tenant.id === this.currentTenant.tenantId
        );
      });

    if (!tenant) {
      return [];
    }

    // return JSON.parse(tenant.roles);
    return tenant.roles;
  }

  /**
   * Return the current tenant plan,
   * check also if it's not expired.
   */
  get currentTenantPlan() {
    if (!this.currentTenant || !this.currentTenant.plan) {
      return plans.free;
    }

    return this.currentTenant.plan;
  }

  /**
   * Returns the allowed storage ids for the user.
   */
  allowedStorageIds() {
    let allowedStorageIds: Array<string> = [];

    Permissions.asArray.forEach((permission) => {
      if (this.has(permission)) {
        allowedStorageIds = allowedStorageIds.concat(
          (permission.allowedStorage || []).map(
            (storage) => storage.id,
          ),
        );
      }
    });

    return [...new Set(allowedStorageIds)];
  }
}
