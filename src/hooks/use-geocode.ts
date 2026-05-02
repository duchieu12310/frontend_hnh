import { useEffect, useState } from 'react';
import FetchUtils from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';

interface GeocodeResult {
  lat: number;
  lon: number;
}

function useGeocode(provinceId?: number, districtId?: number, wardId?: number) {
  const [data, setData] = useState<GeocodeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Chỉ cần có Tỉnh và Huyện là bắt đầu lấy tọa độ (Xã có thể có hoặc không)
    if (!provinceId || !districtId) {
      setData(null);
      return;
    }

    const fetchGeocode = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching geocode for:', { provinceId, districtId, wardId });
        const result = await FetchUtils.get<GeocodeResult>(ResourceURL.GEOCODE, {
          provinceId,
          districtId,
          wardId,
        });
        console.log('Geocode result:', result);
        setData(result);
      } catch (err) {
        console.error('Geocode error:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeocode();
  }, [provinceId, districtId, wardId]);

  return { data, isLoading, error };
}

export default useGeocode;

