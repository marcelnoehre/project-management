import { TestBed, inject } from '@angular/core/testing';

import { RequestService } from './request.service';
import { RequestType } from '../enums/request-type.enum';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('RequestService', () => {
	const url = 'https://mock.api/test';
	let requestService: RequestService;
	let httpMock: HttpTestingController;
  
	beforeEach(() => {
	  TestBed.configureTestingModule({
		imports: [HttpClientTestingModule],
		providers: [RequestService],
	  });
	  requestService = TestBed.inject(RequestService);
	  httpMock = TestBed.inject(HttpTestingController);
	});
  
	afterEach(() => {
	  httpMock.verify();
	});

	describe('setup', () => {
		it('should be created', () => {
			expect(requestService).toBeTruthy();
		});
	
		it('should load test environment', () => {
			expect(environment.environement).toBe('test');
		});
	});

	describe('request types', () => {
		it('should send GET request', () => {
			const mockData = { id: 1, name: 'mock' };
			const params = { param1: 'value1', param2: 'value2' };
			requestService.send(RequestType.GET, url, params).subscribe((data) => {
				expect(data).toEqual(mockData);
			});
			const req = httpMock.expectOne(`${url}?param1=value1&param2=value2`);
			expect(req.request.method).toBe('GET');
			req.flush(mockData);
		});
		
		it('should send POST request', () => {
			const mockData = { success: true };
			const requestBody = { key: 'value' };
			requestService.send(RequestType.POST, url, requestBody).subscribe((data) => {
				expect(data).toEqual(mockData);
			});
			const req = httpMock.expectOne(url);
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toEqual(requestBody);
			req.flush(mockData);
		});
		
		it('should send PUT request', () => {
			const mockData = { success: true };
			const requestBody = { key: 'value' };
			requestService.send(RequestType.PUT, url, requestBody).subscribe((data) => {
				expect(data).toEqual(mockData);
			});
			const req = httpMock.expectOne(url);
			expect(req.request.method).toBe('PUT');
			expect(req.request.body).toEqual(requestBody);
			req.flush(mockData);
		});
		
		it('should send DELETE request', () => {
			const mockData = { success: true };
			const params = { param1: 'value1', param2: 'value2' };
			requestService.send(RequestType.DELETE, url, params).subscribe((data) => {
				expect(data).toEqual(mockData);
			});
			const req = httpMock.expectOne(`${url}?param1=value1&param2=value2`);
			expect(req.request.method).toBe('DELETE');
			req.flush(mockData);
		});
		
		it('should throw an error for invalid request type', () => {
			const params = { param1: 'value1', param2: 'value2' };
			expect(() => {
				requestService.send('INVALID_REQUEST_TYPE' as RequestType, url, params);
			}).toThrowError('ERROR.REQUEST_TYPE');
		});
	});

	describe('adjust url', () => {	
		it('should adjust the URL without parameters', () => {
			const params = {};
			const adjustedUrl = requestService['_adjustUrl'](url, params);
			expect(adjustedUrl).toBe(url);
		});

		it('should adjust the URL with one parameter', () => {
			const params = { param1: 'value1' };
			const adjustedUrl = requestService['_adjustUrl'](url, params);
			expect(adjustedUrl).toBe(`${url}?param1=value1`);
		});
		
		it('should adjust the URL with multiple parameters', () => {
			const params = { param1: 'value1', param2: 'value2', param3: 'value3' };
			const adjustedUrl = requestService['_adjustUrl'](url, params);
			expect(adjustedUrl).toBe(`${url}?param1=value1&param2=value2&param3=value3`);
		});
	});
});
