import * as authService from '../services/auth.service';









describe('default color', () => {
    it('should return a color from the defaultColors array', () => {
        expect(['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFFFF']).toContain(authService.defaultColor());
    });
});

describe('generate intiials', () => {
    it('should generate initials for splitted full name', () => {
        expect(authService.generateInitials('splitted name')).toBe('SN');
    });

    it('should generate initials for splitted full name', () => {
        expect(authService.generateInitials('single')).toBe('S');
    });
});