import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingsComponent } from './project-settings.component';
import { AppModule } from 'src/app/app.module';
import { environment } from 'src/environments/environment';
import { Permission } from 'src/app/enums/permission.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api/api.service';
import { TestService } from 'src/app/services/api/test.service';

describe('ProjectSettingsComponent', () => {
	let component: ProjectSettingsComponent;
	let fixture: ComponentFixture<ProjectSettingsComponent>;
	let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

	beforeEach(() => {
		snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
		TestBed.configureTestingModule({
			imports: [AppModule],
			declarations: [ProjectSettingsComponent],
			providers: [
				{ provide: MatSnackBar, useValue: snackbarSpy },
				{ provide: ApiService, useClass: TestService }
			]
		});
		fixture = TestBed.createComponent(ProjectSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('setup', () => {
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	
		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should intialize the data', () => {
			expect(component['_loadingDelete']).toBe('');
			expect(component['_languages']).toEqual([
				{
					key: 'en',
					label: 'English'
				},
				{
					key: 'de',
					label: 'Deutsch'
				}
			]);
			expect(component.permissions).toEqual([Permission.MEMBER, Permission.ADMIN]);
			expect(component.loadingInvite).toEqual(false);
			expect(component.loadingLeave).toBe(false);
			expect(component.members).toEqual([]);
		});

		it('should initialize the list of team members', async () => {
			component['_user'].token = 'mock';
			await component.ngOnInit();
			expect(component.members.length).toBe(4);
			expect(component.members).toEqual([
				{
					token: 'owner', 
					username: 'owner', 
					fullName: 'Mock Owner', 
					initials: 'MO', 
					color: '#FFFFFF', 
					language: 'en', 
					project: 'MockProject', 
					permission: Permission.OWNER, 
					profilePicture: '', 
					notificationsEnabled: true, 
					isLoggedIn: true, 
					stats: { created: 91, imported: 10, updated: 45, edited: 78, trashed: 32, restored: 57, deleted: 23, cleared: 69 }
				},
				{ 
					token: 'admin', 
					username: 'admin', 
					fullName: 'Mock Admin', 
					initials: 'MA', 
					color: '#FFFFFF', 
					language: 'en', 
					project: 'MockProject', 
					permission: Permission.ADMIN, 
					profilePicture: '', 
					notificationsEnabled: true, 
					isLoggedIn: true, 
					stats: { created: 42, imported: 15, updated: 78, edited: 63, trashed: 29, restored: 51, deleted: 94, cleared: 12 } 
				}, { 
					token: 'member', 
					username: 'member', 
					fullName: 'Mock Member', 
					initials: 'MM', 
					color: '#FFFFFF', 
					language: 'de', 
					project: 'mockProject', 
					permission: Permission.MEMBER, 
					profilePicture: '', 
					notificationsEnabled: false, 
					isLoggedIn: true, 
					stats: { created: 64, imported: 27, updated: 89, edited: 14, trashed: 50, restored: 73, deleted: 3, cleared: 67 } 
				}, { 
					token: 'invited', 
					username: 'invited', 
					fullName: 'Mock Invited', 
					initials: 'MI', 
					color: '#FFFFFF', 
					language: 'en', 
					project: 'MockProject', 
					permission: Permission.INVITED, 
					profilePicture: '', 
					notificationsEnabled: true, 
					isLoggedIn: true, 
					stats: { created: 77, imported: 42, updated: 19, edited: 56, trashed: 83, restored: 5, deleted: 38, cleared: 91 }
				}
			]);
		});
	});

	describe('formcontrol', () => {
		it('should create inviteForm', () => {
			expect(component.inviteForm).toBeDefined();
		});

		it('should create inviteForm with usernameFormControl', () => {
			expect(component.inviteForm.get('usernameFormControl')).toBeDefined();
		});

		it('should set validators for usernameFormControl', () => {
			const usernameErrors = component.inviteForm.get('usernameFormControl')?.errors;
			const isUsernameRequired = usernameErrors?.['required'];
			expect(isUsernameRequired).toBeTruthy();
		});

		it('should return the correct username value', () => {
			component.inviteForm.get('usernameFormControl')?.setValue('mockUsername');	
			const username = component['_username'];
			expect(username).toBe('mockUsername');
		});

		it('should check if username is valid', () => {
			component.inviteForm.controls['usernameFormControl'].setValue('validUsername');
			expect(component.usernameValid()).toBeTruthy();
		});

		it('should check if username is invalid', () => {
			component.inviteForm.controls['usernameFormControl'].setValue('');
			expect(component.usernameValid()).toBeFalsy();
		});
	});

	describe('checks', () => {
		it('should get the language', () => {
			expect(component.getLanguage('en')).toBe('English');
		});

		it('should not get the language', () => {
			expect(component.getLanguage('xyz')).toBe('xyz');
		});

		it('should be editable', () => {
			component['_user'].permission = Permission.OWNER;
			expect(component.isEditable(Permission.ADMIN)).toBe(true);
			expect(component.isEditable(Permission.MEMBER)).toBe(true);
		});

		it('should be not editable', () => {
			component['_user'].permission = Permission.ADMIN;
			expect(component.isEditable(Permission.MEMBER)).toBe(false);
		});

		it('should be leavable', () => {
			component['_user'].permission = Permission.ADMIN;
			expect(component.isLeavable()).toBe(false);
		});

		it('should be not leavable', () => {
			component['_user'].permission = Permission.OWNER;
			expect(component.isLeavable()).toBe(true);
		});

		it('should show invite', () => {
			component['_user'].permission = Permission.ADMIN;
			expect(component.showInvite()).toBe(true);
		});

		it('should not show invite', () => {
			component['_user'].permission = Permission.MEMBER;
			expect(component.showInvite()).toBe(false);
		});

		it('should disabled remove', () => {
			component['_user'].permission = Permission.OWNER;
			expect(component.disableRemove('ADMIN')).toBe(false);
		});

		it('should not disable remove', () => {
			component['_user'].permission = Permission.ADMIN;
			expect(component.disableRemove('ADMIN')).toBe(true);
		});

		it('should have an error', () => {
			expect(component.hasError('usernameFormControl', 'required')).toBe(true);
		});

		it('should not have an error', () => {
			component.inviteForm.get('usernameFormControl')?.setValue('mockUsername');
			expect(component.hasError('usernameFormControl', 'required')).toBe(false);
		});
	});

	describe('invite user', () => {
		it('should invite a user', async () => {
			component.inviteForm.get('usernameFormControl')?.setValue('inviteAnother');
			await component.ngOnInit();
			component['_user'].user = component.members[0];
			const amount = component.members.length;
			await component.inviteUser();
			expect(component.members.length).toBe(amount + 1);
			expect(component['_username']).toBeFalsy();
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.INVITE_DELIVERD', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});

		it('should handle none existing user', async () => {
			component.inviteForm.get('usernameFormControl')?.setValue('invalid');
			await component.ngOnInit();
			component['_user'].user = component.members[0];
			const amount = component.members.length;
			await component.inviteUser();
			expect(component.members.length).toBe(amount);
			expect(component['_username']).toBe('invalid');
			expect(snackbarSpy.open).toHaveBeenCalledWith(jasmine.any(Error), 'APP.OK', { duration: 7000, panelClass: 'info' });
		});
	});

	it('should update the permission', async () => {
		await component.ngOnInit();
		component['_user'].user = component.members[0];
		await component.updatePermission('member', { value: Permission.ADMIN });
		expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.PERMISSION_UPDATED', 'APP.OK', { duration: 7000, panelClass: 'info' });
	});

	describe('remove user', () => {
		it('should remove the user', async () => {
			component['_user'].token = 'owner';
			await component.ngOnInit();
			const amount = component.members.length;
			await component.processRemove('mock', 0, true);
			expect(component.members.length).toBe(amount - 1);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.REMOVE_MEMBER', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});

		it('should not remove the user', async () => {
			component['_user'].token = 'owner';
			await component.ngOnInit();
			const amount = component.members.length;
			await component.processRemove('mock', 0, false);
			expect(component.members.length).toBe(amount);
			expect(snackbarSpy.open).not.toHaveBeenCalled();
		});
	});

	describe('leave project', () => {
		it('should leave the project', async () => {
			component['_user'].token = 'owner';
			await component.processLeave(true);
			expect(snackbarSpy.open).toHaveBeenCalledWith('SUCCESS.LEAVE_PROJECT', 'APP.OK', { duration: 7000, panelClass: 'info' });
		});

		it('should not leave the project', async () => {
			component['_user'].token = 'owner';
			await component.processLeave(false);
			expect(snackbarSpy.open).not.toHaveBeenCalled();
		});
	});
});
