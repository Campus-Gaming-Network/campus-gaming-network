import Router from 'express-promise-router';

import controllers from '../../controllers';

const router = Router();

router.get('/', controllers.School.getSchools);

router.get('/:handle', controllers.School.getSchoolByHandle);

router.post('/', controllers.School.createSchool);

router.put('/:handle', controllers.School.updateSchool);

router.delete('/:handle', controllers.School.deleteSchool);

router.get('/:handle/users', controllers.School.getSchoolUsers);

router.get('/:handle/events', controllers.School.getSchoolEvents);

export default router;
