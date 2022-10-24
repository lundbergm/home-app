import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

const tibberMockMode = e('TIBBER_MOCK_MODE', 'boolean');
const tibberHomeId = e('TIBBER_HOME_ID', 'string');
const tibberAccessToken = e('TIBBER_ACCESS_TOKEN', 'string');
const tibberApiUrl = e('TIBBER_API_URL', 'string');
const modbusMockMode = e('MODBUS_MOCK_MODE', 'boolean');
const modbusPath = e('MODBUS_PATH', 'string');

const config = {
    tibber: {
        accessToken: tibberAccessToken,
        baseUrl: tibberApiUrl,
        homeId: tibberHomeId,
        mockMode: tibberMockMode,
    },
    modbus: {
        mockMode: modbusMockMode,
        path: modbusPath,
    },
};

function e(key: string, type: 'string'): string;
function e(key: string, type: 'integer'): number;
function e(key: string, type: 'boolean'): boolean;
function e(key: string, type: 'string' | 'integer' | 'boolean'): string | number | boolean {
    const value = env[key];

    if (value === undefined) {
        throw new Error(`Missing required configuration key '${key}'`);
    }

    let toReturn: string | number | boolean | undefined | null;
    if (type === 'string') {
        toReturn = value;
    } else if (type === 'integer') {
        toReturn = parseInt(value, 2);
    } else if (type === 'boolean') {
        toReturn = value.toLowerCase() === 'true';
    } else {
        throw new Error(`Unknown configuration type '${key}'`);
    }

    if (toReturn === null || toReturn === undefined || (typeof toReturn === 'number' && isNaN(toReturn))) {
        throw new Error(`Could not parse required configuration value '${value}'`);
    }

    return toReturn;
}

export default config;
export type AppConfig = typeof config;
