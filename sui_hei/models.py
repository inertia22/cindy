from django.contrib.auth.models import (AbstractBaseUser, AbstractUser,
                                        BaseUserManager)
from django.db import connections, models
from django.utils.translation import ugettext_lazy as _


# Create your models here.
class Award(models.Model):
    name = models.CharField(max_length=255, null=False)
    description = models.TextField(default="")

    class Meta:
        verbose_name = _("Award")

    def __str__(self):
        return self.name


class User(AbstractUser):
    nickname = models.CharField(_('nick_name'), max_length=255, null=False)
    profile = models.TextField(_('profile'), default="")
    current_award = models.ForeignKey(Award, null=True)
    experience = models.IntegerField(_('experience'), default=0)

    REQUIRED_FIELDS = ['nickname']

    def get_full_name(self):
        return self.nickname

    def get_short_name(self):
        return self.nickname

    def __str__(self):
        return self.nickname


class UserAward(models.Model):
    user_id = models.ForeignKey(User)
    award_id = models.ForeignKey(Award)

    class Meta:
        verbose_name = _("User-Award")

    def __str__(self):
        return "[%s] owns [%s]" % (self.user_id.nickname, self.award_id)


class Mondai(models.Model):
    '''
    genre:
      0: umigame
      1: tobira
      2: kameo
      3: shin-keshiki
    '''
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user_id = models.ForeignKey(User, db_column='user_id')
    title = models.CharField(_('title'), max_length=255, null=False)
    yami = models.BooleanField(_('yami'), default=False, null=False)
    genre = models.IntegerField(_('genre'), default=0, null=False)
    content = models.TextField(_('content'), null=False)
    kaisetu = models.TextField(_('kaisetu'), null=False)
    seikai = models.BooleanField(_('seikai'), null=False)
    created = models.DateTimeField(_('created'), null=False)
    modified = models.DateTimeField(_('modified'), null=False)
    status = models.IntegerField(_('status'), default=0, null=False)
    memo = models.TextField(_('memo'), default="")
    score = models.FloatField(_('score'), default=0, null=False)

    class Meta:
        verbose_name = _("Soup")

    def __str__(self):
        return self.title


class Shitumon(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user_id = models.ForeignKey(User, db_column='user_id')
    mondai_id = models.ForeignKey(Mondai, db_column='mondai_id')
    shitumon = models.TextField(_('shitumon'), null=False)
    kaitou = models.TextField(_('kaitou'), null=True)
    good = models.BooleanField(_('good_ques'), default=False, null=False)
    true = models.BooleanField(_('true_ques'), default=False, null=False)
    askedtime = models.DateTimeField(_('askedtime'), null=False)
    answeredtime = models.DateTimeField(_('answeredtime'), null=True)

    class Meta:
        verbose_name = _("Question")

    def __str__(self):
        return "[%s]%s: {%s} puts {%50s}" % (self.mondai_id.id, self.mondai_id,
                                             self.user_id, self.shitumon)


class Lobby(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user_id = models.ForeignKey(User, db_column='user_id')
    channel = models.TextField(_('channel'), default="lobby", null=False)
    content = models.TextField(_('content'), null=False)
    #score = models.SmallIntegerField(_('score'), default=50)

    class Meta:
        permissions = (
            ("can_add_info", _("Can add homepage info")),
            ("can_grant_award", _("Can grant awards to users")), )
        verbose_name = _("Lobby")

    def __str__(self):
        return "[%s]: {%s} puts {%50s}" % (self.channel, self.user_id,
                                           self.content)


class Star(models.Model):
    user_id = models.ForeignKey(User, db_column='user_id')
    mondai_id = models.ForeignKey(Mondai, db_column='mondai_id')
    value = models.FloatField(_('Value'), null=False, default=0)

    class Meta:
        verbose_name = _("Star")

    def __str__(self):
        return "%s -- %.1f --> %s" % (self.user_id, self.value, self.mondai_id)
